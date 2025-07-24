---
title: How to Be Paranoid
image: /images/photo-1647424824945-d7d22200ac39.avif
imageMeta:
  attribution: "Caitlin Taylor"
  attributionLink: https://unsplash.com/photos/a-dark-hallway-with-a-bench-and-lights-P5_OMnAVnl0
featured: true
authors:
  - nullvoxpopuli
date: Thu Jul 24 2025 14:39:49 GMT-0400 (Eastern Daylight Time)
tags:
  - security
  - javascript
---

How do you _trust_ that your macihne is safe?

If we don't have exact [Indicators of Compromise](https://www.crowdstrike.com/en-us/blog/crowdstrike-falcon-prevents-npm-package-supply-chain-attacks/), what do we need to check for?

Initially, when I found out about  [CVE-2025-54313](https://nvd.nist.gov/vuln/detail/CVE-2025-54313) / [GHSA-f29h-pxvx-f335](https://github.com/advisories/GHSA-f29h-pxvx-f335), or _any_ vulnernability, I have to decide if there is, beyond a shadow of a doubt, sufficient evidence to do nothing, else, I have to do a bunch of key-rolling -- which takes about 15 minutes on my personal hardware, and an hour and a half on work hardware (due to MacOS being way slower than linux).


In this case, the day prior, I was doing a lot of open source development for a library that my employer makes heavy use of, and noticed that my pull requset was conflicting with `main` frequently due to [renovate](https://github.com/renovatebot/renovate) running _very eagerly_ on dependency updates. I needed the repo's CI to run all the scenarios for me, because enumerating all the tested / supported scenarios without knowing where errors exist is time consuming and cumbersome -- and GitHub does not run CI for pull requsets if there is a conflict. So I was regularly rebasing.

Normally this isn't a big deal, but I just _didn't know_ -- which is not an acceptable state to be in to "decide to do nothing". 

At the time I decided I had to deal with the possibility of my two computers being infected with the malware, I didn't have sufficient knowledge for a targeted sweep / clean of my systems. All I knew was that the malware would steal credentials and upload them somewhere.

So I had to do the heavy-handed investigative process:
- Disable WiFi / all internet connections on both devices
- On my phone, review audit logs from GitHub.
    - Discover than NPM does not have an audit log.
    - Discover that GitHub doesn't have an auditlog of your SSH (git cli) activity...
    - Delete SSH Keys on GitHub
- Write a script [now located here](https://github.com/NullVoxPopuli/dotfiles/commit/051eb2144a837144ba1e7357becb2f4fb0024df8) to help scan for suspicious copies of the libraries reported in the above-linked reports.
    - Through this process I realized that if I were trying to defend against myself, I would not win. Not knowing enough about the attack, I had to assume the worst:
        - I can't sufficiently trust:
            - checking for libraries installed on my desk under the name of the published package -- if I were trying to do an attack, I would have the code copy itself elsewhere 
            - checking the library's version -- I would try to publish a malicious package with the version of a trusted copy of the package
            - checking for a `package.json` with the name of the affected packages -- I would change the name if I were trying to evade detection
        - So my script scans all directories `node` has access to -- which for all intents and purposes include every folder that doesn't require `sudo` to access (as I never install dev tools with `sudo`)
- The script didn't tell me I was compromised, but given that I kept thinking of ways to circumvent myself, I had to go further. I couldn't trust automated detection of an attack I didn't know the details of.
- I decided to delete all `node_modules` on my machines
    ```bash
    find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
    ```
    This took about 7 minutes for my hundreds of GB of JS projects an their dependencies.
    On the work MacOS it took about 45 minutes.

- I also deleted things that I knew could have `node_modules`, but potentially not have them kept in a `node_modules` directory
    - Uninstall and Delete caches of: Discord, Slack, Cursor, Windsurf, etc (All Electron-based applications)
    - Delete global cache directories: `rm -rf ~/.pnpm-store`, or `pnpm store prune`, for example.
- I suspected that if me as an attacker in the try-hardest mode I could think of potentially wouldn't even use node
- Rebooting the computer would ensure that anything that began running would be stopped (be that a node process or otherwise)
- However, if there is malicious code disquising itself, it's potentially possible it started up again at login
    - There is where code-signing comes in to play -- applications that are not signed by a central authority do not have permission to install themselves and start up.


When I started the computers back up again, I was ready to investigate the signatures of all the running binaries -- but then I found out the attack was only for windows machines (after confirming with 10+ well known security sources) -- and... I just stopped -- I didn't need to do all this work.

_But I'm glad I did_. I solved my paranoia.

I also didn't re-install Cursor and Windsurf, which is a win.
