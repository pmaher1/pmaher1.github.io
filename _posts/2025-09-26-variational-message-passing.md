---
layout: post
title: "Variational Message Passing"
date: 2025-09-26
description: "Derivation and algorithmic structure of variational message passing for conjugate exponential-family models."
tags: [variational inference, message passing]
---

Variational message passing (VMP) exploits conditional conjugacy in probabilistic models whose factors lie in the exponential family. When a conditional distribution can be written as

$$
P(\mathbf{X}\mid\mathbf{Z}) = \exp\left[\phi(\mathbf{Z})^{T}\,\mathbf{u}(\mathbf{X}) + f(\mathbf{X}) + g(\mathbf{Z})\right],
$$

knowing the natural parameter $\phi(\mathbf{Z})$ allows the expectation of the sufficient statistic $\mathbf{u}(\mathbf{X})$ to be recovered. Reparameterising $g$ in terms of $\phi$ gives

$$
P(\mathbf{X}\mid\phi) = \exp\left[\phi^{T}\mathbf{u}(\mathbf{X}) + f(\mathbf{X}) + \tilde{g}(\phi)\right],
$$

and differentiating $\tilde{g}$ shows

$$
\mathbb{E}_{P(\mathbf{X}\mid\phi)}\big[\mathbf{u}(\mathbf{X})\big] = -\frac{d\tilde{g}(\phi)}{d\phi}.
$$

This result underpins the moment updates VMP performs across a directed acyclic graph.

![Flow of messages in a conjugate graphical model](/assets/img/posts/variational-message-passing/Figure-2-VMP.jpg)

## Conditional conjugacy and local updates

Consider a latent variable $Z$ with parents $\text{pa}_{Z}$ and children $\text{ch}_{Z}$. Its conditional log-density can be written as

$$
\log P(Z\mid\text{pa}_{Z}) = \phi_{Z}(\text{pa}_{Z})^{T}\mathbf{u}_{Z}(Z) + f_{Z}(Z) + g_{Z}(\text{pa}_{Z}).
$$

A child $X\in\text{ch}_{Z}$ yields an additional term

$$
\log P(X\mid Z, \text{cp}_{Z}) = \phi_{XZ}(X, \text{cp}_{Z})^{T}\mathbf{u}_{Z}(Z) + \lambda(X, \text{cp}_{Z}),
$$
where $\text{cp}_{Z}$ denotes co-parents of $Z$. The optimal factor for $Z$ in a mean-field variational family is therefore

$$
\log Q_{Z}^{*}(Z) = \Bigg[\mathbb{E}_{-q(z)}\big[\phi_{Z}(\text{pa}_{Z})\big] + \sum_{k\in\text{ch}_{Z}} \mathbb{E}_{-q(z)}\big[\phi_{XZ}(X_{k}, \text{cp}_{Z})\big]\Bigg]^{T}\mathbf{u}_{Z}(Z) + f_{Z}(Z) + c,
$$
with $c \in \mathbb{R}$. Hence $Q_{Z}^{*}$ is again in the same exponential family with natural parameter

$$
\phi_{Z}^{*} = \mathbb{E}_{-q(z)}\big[\phi_{Z}(\text{pa}_{Z})\big] + \sum_{k\in\text{ch}_{Z}} \mathbb{E}_{-q(z)}\big[\phi_{XZ}(X_{k}, \text{cp}_{Z})\big].
$$

Because these expectations are multilinear in the moments of neighbouring variables, they can be reparameterised as functions of incoming messages:

$$
\begin{aligned}
\tilde{\phi}_{Z}&\left(\{\mathbb{E}_{q}[\mathbf{u}_{i}]\}_{i\in\text{pa}_{Z}}\right) = \mathbb{E}\big[\phi_{Z}(\text{pa}_{Z})\big],\\
\tilde{\phi}_{XZ}&\left(\mathbb{E}_{q}[\mathbf{u}_{k}], \{\mathbb{E}_{q}[\mathbf{u}_{j}]\}_{j\in\text{cp}_{k}}\right) = \mathbb{E}\big[\phi_{XZ}(X_{k}, \text{cp}_{k})\big].
\end{aligned}
$$

## Message definitions

Messages in VMP are expressed directly in terms of expected sufficient statistics:

- **Parent-to-child:**
  $$\mathbf{m}_{Y\rightarrow X} = \mathbb{E}_{q}\big[\mathbf{u}_{Y}\big].$$
- **Child-to-parent:**
  $$\mathbf{m}_{X\rightarrow Y} = \tilde{\phi}_{XY}\left(\mathbb{E}_{q}[\mathbf{u}_{X}], \{\mathbf{m}_{i\rightarrow X}\}_{i\in\text{cp}_{Y}}\right).$$

Observed nodes supply their sufficient statistics directly. Once all messages arrive at $Y$, the updated natural parameter is

$$
\phi_{Y}^{*} = \tilde{\phi}_{Y}\left(\{\mathbf{m}_{i\rightarrow Y}\}_{i\in\text{pa}_{Y}}\right) + \sum_{j\in\text{ch}_{Y}} \mathbf{m}_{j\rightarrow Y},
$$
from which the refreshed moment vector $\mathbb{E}_{Q^{*}_{Y}}[\mathbf{u}_{Y}]$ is recovered via the exponential-family relationship above.

![Colour-coded example of information flow](/assets/img/posts/variational-message-passing/Colour-Coded.png)

## Algorithm

The full procedure can be summarised as follows:

1. **Initialise** each factor $Q_{j}$ by setting a starting moment vector $\mathbb{E}_{q}[\mathbf{u}_{j}(X_{j})]$.
2. **Cycle through nodes** $X_{j}$:
   - gather incoming parent and child messages;
   - update the natural parameter $\phi^{*}_{j}$ using the rule above;
   - recompute the moment vector $\mathbb{E}_{q}[\mathbf{u}_{j}(X_{j})]$.
3. **Optionally monitor** the evidence lower bound (ELBO) $\mathcal{L}(Q)$.
4. **Stop** when the ELBO improvement is negligible or a maximum number of passes is reached.

![High-level algorithm schematic](/assets/img/posts/variational-message-passing/Algorithm.png)

### Derivation sketch

Starting from the exponential-family form

$$
P(\mathbf{X}\mid\phi) = \exp\left[\phi^{T}\mathbf{u}(\mathbf{X}) + f(\mathbf{X}) + \tilde{g}(\phi)\right],
$$
normalisation implies

$$
\int P(\mathbf{X}\mid\phi)\,d\mathbf{X} = 1.
$$
Differentiating under the integral sign yields the relationship between the log-partition function $\tilde{g}(\phi)$ and the expected sufficient statistics used throughout the VMP updates.

For a concrete worked example, see the univariate Gaussian model derivation in the project notes.

![Composite illustration of variational message passing](/assets/img/posts/variational-message-passing/VariationalMessagePassingLowQuality.png)
