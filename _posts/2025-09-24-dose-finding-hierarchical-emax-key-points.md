---
layout: post
title: "Dose-finding with a Bayesian hierarchical EMAX model — key points"
date: 2025-09-24
description: "Bullet-point summary of the key points from the hierarchical EMAX dose-finding post."
tags: [bayesian, clinical trials, dose-finding]
published: false
---

*Condensed talking points for the companion post of the same title. Hidden (not published).*

## The setting

- **ASITI-201-T1D**: planned randomised dose-finding trial of an islet antigen-specific immunotherapy for type 1 diabetes.
- Placebo + three subcutaneous doses (0.1, 0.3, 1 mL); **n = 18**, allocated 6:4:4:4.
- Tiny sample makes the conventional analysis - **independent pairwise comparisons (IPC)** - wasteful: it ignores that response varies *smoothly* with dose, and that we already hold prior knowledge from earlier trials.
- Aim: a **Bayesian hierarchical EMAX (BH-EMAX)** model that restores both. Presented at ACTA 2024; extends [Gajewski et al. (2019)](https://doi.org/10.1002/sim.8167).

## Outcome model

- Binomial responses per dose: $y_d \sim \operatorname{Binomial}(n_d, p_d)$, with $p_d = \operatorname{logit}^{-1}(\theta_d)$.
- Control arm modelled **separately**, $\theta_1 \sim \operatorname{Normal}(0, 10^2)$ - placebo estimated from placebo data alone.
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
