#!/usr/bin/env Rscript
# Knit an R Markdown file from _rmd/ into a Jekyll post in _posts/,
# saving generated figures under assets/img/posts/<slug>/.
#
# Usage (run from the repo root):
#   Rscript _scripts/knit_post.R _rmd/2026-06-30-my-post.Rmd

args <- commandArgs(trailingOnly = TRUE)
if (length(args) < 1) {
  stop("Usage: Rscript _scripts/knit_post.R _rmd/YYYY-MM-DD-my-post.Rmd")
}

rmd_path <- args[1]
if (!file.exists(rmd_path)) {
  stop("File not found: ", rmd_path)
}
if (!file.exists("_config.yml")) {
  stop("Run this script from the repo root (no _config.yml found here).")
}

slug <- tools::file_path_sans_ext(basename(rmd_path))
post_name <- sub("^\\d{4}-\\d{2}-\\d{2}-", "", slug)
fig_path <- paste0("assets/img/posts/", post_name, "/")
out_md <- file.path("_posts", paste0(slug, ".md"))

knitr::opts_knit$set(base.dir = getwd())
knitr::opts_chunk$set(fig.path = fig_path, fig.align = "center")

knitr::knit(rmd_path, output = out_md, envir = new.env())

# knitr writes figure links relative to the repo root (e.g. "assets/img/...").
# Jekyll's pretty permalinks (/blog/:year/:title/) need root-relative links,
# so add the leading slash. knitr may emit markdown ![](path) or HTML
# <img src="path">, so patch both forms explicitly.
lines <- readLines(out_md)
lines <- gsub(
  paste0('src="', fig_path),
  paste0('src="/', fig_path),
  lines, fixed = TRUE
)
lines <- gsub(
  paste0('](', fig_path),
  paste0('](/', fig_path),
  lines, fixed = TRUE
)
writeLines(lines, out_md)

cat("Knitted:", rmd_path, "->", out_md, "\n")
cat("Figures saved to:", fig_path, "\n")
