---
title: My pi.hole was periodically blocking linux 
image: /images/photo-1520337331195-8efdf4db2064.avif
imageMeta:
  attribution: Stéphan Valentin
  attributionLink: https://unsplash.com/photos/worms-eye-view-photo-of-concrete-buildings-EY-LnlxAnWs
featured: true
authors:
  - nullvoxpopuli
date: Sun Nov 17 2024 22:05:16 GMT-0500 (Eastern Standard Time)
tags:
  - linux
---


Ubuntu Linux ships with the ability to reach any host on your local network via `$HOSTNAME.local`, where if the `hostname` for a machine on your network is `$HOSTNAME`, it may be reached at `$HOSTNAME.local` instead of its ip address. This is a very convinient feature since working with ip addresses are somewhat obnoxious. 

In any case, while this is useful, I have manually set up some DNS entries on my [pi.hole](https://pi-hole.net/) (which I use for network-wide ad-blocking for all devices (phones!)).

The pi.hole has a default DNS request rate limit of 1000 requests in 60 seconds. And Ubuntu was regularly surpassing this by doing "Reverse DNS" PTR requests to `in-addr.arpa`. Now, every time I looked at the pi.hole logs, these were cache-hits, but the fact of exceeding 1000 requests in 60 seconds remained. When this limit is exceeded, I was no longer able to operate my computer where DNS requests were required (such as during `git push`).

Through some light investigation, I found that this built-in behavior bundled with the default Ubuntu install is caused by a program called `avahi-daemon`. 

So, to fix my issue, I just uninstalled `avahi-daemon`

```bash
sudo apt remove avahi-daemon
```

And my problems were solved!



[This StackOverflow/SuperUser post](https://superuser.com/a/316767) is a good resource for details
