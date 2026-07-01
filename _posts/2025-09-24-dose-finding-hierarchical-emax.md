---
layout: post
title: "Dose-finding with a Bayesian hierarchical EMAX model"
date: 2025-09-24
description: "Extending a Bayesian hierarchical EMAX model with expert-informed priors for a small dose-finding trial in type 1 diabetes, and testing it by simulation against independent pairwise comparisons."
tags: [bayesian, clinical trials, dose-finding]
published: false
---

Early-phase dose-finding trials are chronically short of data. **ASITI-201-T1D** is a planned randomised dose-finding trial of an islet antigen-specific immunotherapy for type 1 diabetes, comparing placebo against three subcutaneous doses. Only **18 participants** are randomised, in a 6:4:4:4 ratio to placebo and the 0.1, 0.3 and 1 mL doses. With four arms and so few observations, the conventional analysis - a set of **independent pairwise comparisons (IPC)** of each active dose against control - throws away two things we usually believe: that response varies *smoothly* with dose, and that we already hold *prior knowledge* from earlier trials.

This post walks through a **Bayesian hierarchical EMAX model (BH-EMAX)** that puts both of those beliefs back in, and how it fared against IPC in simulation. The work was presented at the ACTA 2024 Clinical Trials and Registries Symposium; the model follows [Gajewski et al. (2019)](https://doi.org/10.1002/sim.8167), extended to let expert priors on the response probabilities enter cleanly.

## The outcome model

For each dose $d$ we observe a binomial count of favourable outcomes,

$$
y_d \sim \operatorname{Binomial}(n_d,\, p_d), \qquad p_d = \operatorname{logit}^{-1}(\theta_d).
$$

Everything happens on the logit scale $\theta_d$. The control arm ($d = 1$) is modelled on its own with a deliberately vague prior, $\theta_1 \sim \operatorname{Normal}(0, 10^2)$, so placebo response is estimated from placebo data alone.

The two models differ only in how they treat the *active* doses.

**Independent pairwise comparisons (IPC).** Each active dose gets its own logit, drawn from an independent, weakly informative prior. There is no link between doses: learning that 0.3 mL works tells the model nothing about 1 mL. This is robust but wasteful when the sample is tiny.

**Hierarchical EMAX (BH-EMAX).** The active doses share a smooth dose-response curve. Writing $\nu_d = \sqrt{\text{dose}_d}$ for the *effective dose strength*,

$$
\theta_d = \phi_1 + \frac{\phi_2\,\nu_d}{\nu_d + \phi_3} + \psi_d, \qquad d \in \{2,\dots,D\}.
$$

Each parameter has a clear reading:

- $\phi_1$ is the **floor** - the logit response as dose strength goes to zero. Its prior $\phi_1 \sim \operatorname{Normal}(-3.944, 1)$ sits at $\operatorname{logit}^{-1}(-3.944) \approx 0.02$, i.e. a ~2% background response.
- $\phi_2$ is the **maximum effect** above the floor, $\phi_2 \sim \operatorname{Normal}(0, 10^2)$.
- $\phi_3$ is the **ED50**, the dose strength delivering half of that maximum effect, with a positively truncated prior $\phi_3 \sim \operatorname{Normal}(3, 10^2)\,\mathbb{1}[0,500]$.
- $\psi_d$ is a **hierarchical deviation** that lets each dose depart from the smooth curve, $\psi_d \sim \operatorname{Normal}(0, \phi_4)$ with $\phi_4 \sim \operatorname{InvGamma}(2, 2)$. Shrinking these deviations toward zero is what lets the model bend to a **non-monotonic** dose-response without abandoning the EMAX shape entirely.

In Stan, the transformed parameters and model block are compact:

```stan
transformed parameters {
  real theta[D];
  real P[D];
  theta[1] = theta_1;                 // control dose, modelled separately
  P[1] = inv_logit(theta_1);
  for (d in 2:D) {
    theta[d] = phi[1] + phi[2] * nu[d] / (nu[d] + phi[3]) + psi[d];
    P[d] = inv_logit(theta[d]);
  }
}
model {
  for (d in 1:D)
    target += beta_lpdf(P[d] | alpha_pseudo[d], beta_pseudo[d]);  // expert prior
  phi[1] ~ normal(-3.944, 1);         // logit floor (~2% response)
  phi[2] ~ normal(0, 10);             // maximum effect above the floor
  phi[3] ~ normal(3, 10) T[0, 500];   // ED50
  phi4 ~ inv_gamma(2, 2);             // hierarchical SD
  psi  ~ normal(0, phi4);             // dose-specific deviations
  y ~ binomial(n, P);                 // likelihood
}
```

## Borrowing the clinician's expectation

The line that does the extra work is the `beta_lpdf` term. Rather than only regularising the abstract EMAX parameters, we place a prior **directly on each response probability** $p_d$:

$$
p_d \sim \operatorname{Beta}(\alpha_d, \beta_d).
$$

This is convenient because clinicians reason in terms of response *rates*, not logit intercepts. Given an expert's expected proportions $p^\ast_d$, the poster's recipe turns each into a pseudo-count by rounding it to the trial's arm size,

$$
y_d = \begin{cases}
\lfloor n_d p^\ast_d \rfloor, & n_d p^\ast_d - \lfloor n_d p^\ast_d \rfloor < \tfrac12, \\[2pt]
\lceil n_d p^\ast_d \rceil, & \text{otherwise,}
\end{cases}
\qquad
p_d \sim \operatorname{Beta}(0.5 + y_d,\ 0.5 + n_d - y_d),
$$

so that the Beta's **mean is the expert's expectation** and its **concentration $\alpha_d + \beta_d$ is the strength** - literally how many pseudo-participants the opinion is worth. Calibrating to the *overdose* expectation (best response at the middle 0.3 mL dose), the priors used were:

| Dose (mL) | Expert mean $p^\ast$ | Low prior $\operatorname{Beta}(\alpha, \beta)$ | High prior $\operatorname{Beta}(\alpha, \beta)$ |
|:--|:--:|:--:|:--:|
| 0 (placebo) | 0.01 | (1, 99) | (1, 99) |
| 0.1 | 0.20 | (0.4, 1.6) | (0.8, 3.2) |
| 0.3 | 0.60 | (1.2, 0.8) | (2.4, 1.6) |
| 1.0 | 0.40 | (0.8, 1.2) | (1.6, 2.4) |

Both strengths encode the *same* expectation; they differ only in concentration - "low" is worth about two pseudo-observations per arm, "high" about four (a full arm's worth). The uninformative baseline is a Jeffreys $\operatorname{Beta}(0.5, 0.5)$ on every dose. In the simulation harness this is just a switch:

```r
if (PriorStrength == "high") {
  alpha_pseudo <- c(1, 0.80, 2.4, 1.60)
  beta_pseudo  <- c(99, 3.20, 1.6, 2.40)
}
```

## Simulation study

Response data were simulated for **10,000 trials** under two truths:

- **Monotonic:** $p = (0.05, 0.20, 0.40, 0.60)$ - the highest dose (1 mL) is genuinely best.
- **Overdose / non-monotonic:** $p = (0.05, 0.20, 0.60, 0.40)$ - the middle dose (0.3 mL) is best.

The expert prior was calibrated to the *overdose* pattern. That sets up the honest test: in the overdose scenario the prior **agrees** with the truth, while in the monotonic scenario the prior actively **disagrees** with it, expecting the wrong dose to win. Each fitted model reports, per simulated trial, which dose carries the highest posterior response probability (via a `Max_indicator`), and we average that over the 10,000 trials to get the probability of selecting each dose as best.

## Results

The headline is the probability that each dose is picked as the winner (**bold** marks the truly best dose):

| Scenario | Model | 0.1 mL | 0.3 mL | 1 mL |
|:--|:--|:--:|:--:|:--:|
| Monotonic | BH-EMAX | 0.10 | 0.27 | **0.62** |
| Monotonic | IPC | 0.15 | 0.31 | **0.54** |
| Overdose  | BH-EMAX | 0.10 | **0.58** | 0.30 |
| Overdose  | IPC | 0.15 | **0.54** | 0.31 |

So the probability of correctly identifying the best dose was **62% (BH-EMAX) vs 54% (IPC)** under the monotonic truth, and **58% vs 54%** under the non-monotonic truth. BH-EMAX comes out ahead in both - and, encouragingly, it still beats IPC in the monotonic scenario *even though its prior was pointing at the wrong dose*, because the smooth EMAX curve pulls the estimate back toward a monotone shape that the data support. In the overdose scenario, where prior and truth agree, the borrowed opinion sharpens the middle dose further.

The cost of the extra structure showed up as **convergence issues** in the minority of simulated datasets where a small, noisy sample conflicted sharply with the calibrated prior - unsurprising when a four-parameter curve plus a hierarchical variance is asked to fit 18 observations.

## Takeaways

- On a genuinely tiny trial, **borrowing structure across doses and encoding expert opinion buys a few percentage points** of correct dose selection over independent comparisons - modest, but free in the sense that it costs no extra participants.
- Placing the prior **on the response probabilities** rather than the EMAX coefficients keeps elicitation in the clinician's natural units and makes the *strength* of the opinion an explicit, tunable dial.
- Neither model is decisive at $n = 18$: both sit around 55-62% correct selection, a blunt reminder that no amount of modelling manufactures information the data never contained. The hierarchical EMAX helps at the margin and degrades gracefully when its prior is wrong, which is about the most one can ask of a small dose-finding design.
