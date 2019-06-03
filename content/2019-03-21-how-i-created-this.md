---
title: How this blog was created
image: /images/working-on-computer-outside.jpeg
imageMeta:
  attribution:
  attributionLink:
featured: false
authors:
 - nullvoxpopuli
date: Thu Mar 21 2019 13:30:13 GMT-0400 (EDT)
tags:
  - ember
  - abridged-tutorial
---

The tools behind this blog were demo'd at EmberConf by [Chris Manson](https://twitter.com/real_ate) during a 5 minute lightning talk where he went from nothing to deployed in ~5 minutes.

Since I didn't yet have a domain, I figured it would take a bit longer.

Here are the steps I took to create this blog / site:
- buy domain at [namecheap.com](namecheap.com)
- create blog:
    - `ember new website --yarn`
    - `cd website`
    - `ember install empress-blog empress-blog-casper-template`
    - create repo on github
    - push code to github
      ```bash
      git remote add origin <url from github>
      git add .
      git commit -m "first commit"
      git push -u origin master
      ```

- visit netlify and setup a new netlify app
    - connect netlify to the repo I created on github
    - tell netlify about the domain I bought on namecheap
    - configure namecheap to use different Nameservers so that netlify can manage DNS for my domain.
    - wait for those changes to propagate the internet (~20 minutes)
    - notice that netlify says that I need to add a redirect from the netlify default domain to my domain
        - I created this file in config/_redirects

        ```
        # Redirect default Netlify subdomain to primary domain
        https://nullvoxpopuli-website.netlify.com/* https://nullvoxpopuli.com/:splat 301!
        ```
        - add a deploy script to my package.json:
        ```bash
        ember build -e production && cp ./config/_redirects dist/
        ```
        - update my netlify build command under the deploy settings to use `yarn deploy`
- after committing and pushing the _redirects update, I got a build error about one of my dependencies not supporting node 10. I had to create an `.nvmrc` file that specifies node 8, as I found out during my research that netlify will read the `.nvmrc` file to determine which node version to use during build and deployment.
- after waiting for the automated deploy to finish after pushing the `.nvmrc` file, the blog was finally up and running!

Compared to other blogs I've setup in the past, this was very easy, and most of my time was spent on DNS configuration.
