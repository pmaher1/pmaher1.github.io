---
layout: post
title: "Kullback-Leibler Divergence"
date: 2025-09-26
description: "Notes on the KL divergence, its connection to the ELBO, and the supporting role of Jensen's inequality."
tags: [variational inference, information theory]
published: false
---

The Kullback-Leibler (KL) divergence measures the relative entropy between two distributions $Q$ and $P$. Because it quantifies information using the natural logarithm, the units are **nats** - the natural analogue to bits.

Although the KL divergence is often presented as a special case of broader divergences (for example, the $\alpha$-divergence family), it plays a central role in variational inference by connecting approximate posteriors to the evidence lower bound (ELBO).

![Gaussian illustration of the KL divergence](/assets/img/posts/kullback-leibler-divergence/KL-Gauss-Example.png)

## Relation to the ELBO

Starting from the definition of the KL divergence between an approximate posterior $q(z)$ and the true posterior $p(z\mid x)$,

$$
\operatorname{KL}(Q\|\!\|P) = \mathbb{E}_{q}\big[\log q(z)\big] - \mathbb{E}_{q}\big[\log p(z\mid x)\big],
$$
we can add and subtract $\log p(x)$ to expose the ELBO:

$$
\begin{aligned}
\operatorname{KL}(Q\|\!\|P) &= \mathbb{E}_{q}\big[\log q(z)\big] - \mathbb{E}_{q}\big[\log p(z\mid x)\big] + \log p(x) - \log p(x) \\
&= -\mathbb{E}_{q}\big[\log p(x, z) - \log q(z)\big] + \log p(x) \\
&= -\operatorname{ELBO} + \log p(x).
\end{aligned}
$$

Consequently,

$$
\log p(x) = \operatorname{ELBO} + \operatorname{KL}(Q\|\!\|P),
$$

and minimising $\operatorname{KL}(Q\|\!\|P)$ is equivalent to maximising the ELBO with respect to the variational family.

## Jensen's inequality

Jensen's inequality underpins the non-negativity of the KL divergence. For a convex function $\phi$ and integrable random variable $X$,

$$
\phi\big(\mathbb{E}[X]\big) \leq \mathbb{E}[\phi(X)].
$$

![Convex function schematic used in Jensen's inequality](/assets/img/posts/kullback-leibler-divergence/Convex-Function.png)

More generally, for a topological vector space $T$, any measurable convex $\phi : T \rightarrow \mathbb{R}$, and sub-$\sigma$-algebra $\mathcal{G}$,

$$
\phi\big(\mathbb{E}[X\mid\mathcal{G}]\big) \leq \mathbb{E}[\phi(X)\mid\mathcal{G}].
$$

Applying the inequality to $-\log(\cdot)$ shows that

$$
\begin{aligned}
\operatorname{KL}(Q\|\!\|P)
&= -\mathbb{E}_{q}\left[ \log \frac{p(z\mid x)}{q(z)} \right] \\
&\geq -\log \left( \mathbb{E}_{q}\left[ \frac{p(z\mid x)}{q(z)} \right] \right) \\
&= -\log \left( \int p(z\mid x)\,dz \right) = 0.
\end{aligned}
$$

Thus the KL divergence is non-negative, with equality only when $Q = P$ almost everywhere.

![Graphical proof of Jensen's inequality for the probabilistic case](/assets/img/posts/kullback-leibler-divergence/Jensen-Graph.png)

## Perspective

Thinking of variational inference as minimising KL divergence illuminates the optimisation landscape: the ELBO mirrors a lower bound on the model evidence, and every improvement in the bound directly reduces the information gap (in nats) between the approximating family and the true posterior.


