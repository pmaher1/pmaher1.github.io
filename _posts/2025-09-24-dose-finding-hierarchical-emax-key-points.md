---
layout: post
title: "Dose-finding with a Bayesian hierarchical EMAX model — key points"
date: 2025-09-24
description: "Bullet-point summary of the key points from the hierarchical EMAX dose-finding post."
tags: [bayesian, clinical trials, dose-finding]
published: false
---

*Condensed talking points for the companion post of the same title. Hidden (not published).*

As my first blog post for this website I'd like to describe the content of my first conference poster! This was presented at the [Australian Clinical Trials Alliance (ACTA) 2024 conference](https://clinicaltrialsalliance.org.au/events-forums/2024-acta-clinical-trials-symposium/). 

This was a project related to a randomised dose-finding trial for an islet antigen-specific immunotherapy within type 1 diabetes. This was my first time spending a decent amount of time constructing a Bayesian hierarchical model in [Stan](https://mc-stan.org/), utilising informative prior information to account for our planned small sample size.

This modelling approach builds upon the work from [Gajewski et al. (2019)](https://doi.org/10.1002/sim.8167), with an extension to let expert give response probabilities into priors more directly.

## The study context

Within the immunotherapies there were 3 dose levels of interest, being 0.1, 0.3 and 1mL in dosage. These were compared against a placebo treatment, with 18 participants being allocated 6:4:4:4 across placebo, 0.1, 0.3 and 1mL groups respectively.

The key issue in this trial was the sample size. As with other Phase I studies, the small sample size inhibits the study's ability to draw significant conclusions. This common problem leans into the appeal of Bayesian inference. Amongst the multitude of benefits a Bayesian analysis may have (uncertainty quantification, flexible design), the incorporation of *prior belief* is particularly attractive.

Furthermore, the conventional analysis, independent pairwise comparisons (IPC) ignores the shape of the doses, only focuses on each comparison (placebo vs 0.1, placebo vs 0.3, placebo vs 1) independently. 

Thereby, we took inspiration from the hierarchical EMAX model [Gajewski et al. (2019)](https://doi.org/10.1002/sim.8167) with the aim to incorporate expert opinion in an interpretable manner.

## Statisticial Modelling

The outcome was binary, whether there was a response for dose d ($y_d=1$), or not ($y_d=0$), thereby a logistic regression was used, such that,

$$
y_d \sim \operatorname{Binomial}(n_d, p_d) \\ 
p_d = \operatorname{logit}^{-1}(\theta_d)
$$

The placebo arm was kept as non-informative, with $\theta_1 \sim \operatorname{Normal}(0, 10^2)$, such that a placebo's response is derived from placebo data alone. 

For the remaining logit parameters (indicating active treatment arms) two models were considered as inspiration

1. **Independent pairwise comparisons (IPC):** Doses are independently drawn from a weakly informative prior such that there is no borrowing of information across doses. Namely with 


- **IPC (comparator):** each active dose is an independent logit with a weak prior; no borrowing across doses.
- **BH-EMAX:** active doses share a smooth curve, with effective dose strength $\nu_d = \sqrt{\text{dose}_d}$:

$$
\theta_d = \phi_1 + \frac{\phi_2\,\nu_d}{\nu_d + \phi_3} + \psi_d.
$$

- Parameter readings (each a point to mention):
  - $\phi_1$ = **floor** (logit response at zero dose); prior $\operatorname{Normal}(-3.944, 1) \approx 2\%$ background response.
  - $\phi_2$ = **maximum effect** above the floor; $\operatorname{Normal}(0, 10^2)$.
  - $\phi_3$ = **ED50** (dose strength for half-max effect); positively truncated normal.
  - $\psi_d$ = **hierarchical deviation**, $\psi_d \sim \operatorname{Normal}(0, \phi_4)$, $\phi_4 \sim \operatorname{InvGamma}(2,2)$ - lets doses bend to **non-monotonic** shapes while shrinking toward the smooth curve.
- Implementation: EMAX curve + $\psi$ built in Stan `transformed parameters`; expert prior added in the model block via `target += beta_lpdf(P[d] | alpha_pseudo[d], beta_pseudo[d])`.

## Borrowing the clinician's expectation

- Put the prior **directly on each response probability**: $p_d \sim \operatorname{Beta}(\alpha_d, \beta_d)$ - clinicians reason in response *rates*, not logit intercepts.
- Turn expert proportions $p^\ast_d$ into pseudo-counts by rounding to arm size, then $p_d \sim \operatorname{Beta}(0.5 + y_d,\ 0.5 + n_d - y_d)$.
- Beta **mean = expert expectation**; **concentration $\alpha_d + \beta_d$ = strength** (how many pseudo-participants the opinion is worth).
- Calibrated to the **overdose** expectation (best response at 0.3 mL): means $(0.01, 0.20, 0.60, 0.40)$.
- "Low" ≈ 2 pseudo-obs/arm, "high" ≈ 4 (a full arm); **both encode the same expectation, differing only in strength**. Uninformative baseline = $\operatorname{Beta}(0.5, 0.5)$; control pinned near 1% via $\operatorname{Beta}(1, 99)$.

## Simulation study

- **10,000** simulated trials under two truths:
  - **Monotonic:** $p = (0.05, 0.20, 0.40, 0.60)$ → 1 mL truly best.
  - **Overdose / non-monotonic:** $p = (0.05, 0.20, 0.60, 0.40)$ → 0.3 mL best.
- Prior calibrated to the overdose pattern → the honest test: prior **agrees** with truth in the overdose scenario, **disagrees** in the monotonic one (points at the wrong dose).
- Per trial, record which dose has the highest posterior response probability (`Max_indicator`); averaging over trials gives the probability of selecting each dose.

## Results

- Probability of selecting each dose as best (**bold** = truly best dose):

| Scenario | Model | 0.1 mL | 0.3 mL | 1 mL |
|:--|:--|:--:|:--:|:--:|
| Monotonic | BH-EMAX | 0.10 | 0.27 | **0.62** |
| Monotonic | IPC | 0.15 | 0.31 | **0.54** |
| Overdose  | BH-EMAX | 0.10 | **0.58** | 0.30 |
| Overdose  | IPC | 0.15 | **0.54** | 0.31 |

- Correct-selection headline: **monotonic 62% (BH-EMAX) vs 54% (IPC)**; **non-monotonic 58% vs 54%**.
- BH-EMAX wins both - and still beats IPC in the monotonic case *despite a wrong-pointing prior*, because the smooth curve pulls toward the monotone shape the data support.
- Cost: occasional **convergence issues** when a small, noisy sample conflicts sharply with the calibrated prior (a four-parameter curve plus hierarchical variance fitting 18 observations).

## Takeaways

- Borrowing dose structure + expert opinion buys **a few percentage points** of correct selection over IPC - modest, but costs no extra participants.
- Prior on **probabilities** (not EMAX coefficients) keeps elicitation in clinicians' units and makes opinion **strength an explicit dial**.
- Not decisive at $n = 18$ (both ~55-62%): modelling can't manufacture absent information; BH-EMAX helps at the margin and **degrades gracefully when its prior is wrong**.
