# Site Improvement Roadmap

## Status Legend
- [ ] TODO
- [x] DONE
- [~] IN PROGRESS

## Queue (agents work top to bottom)

### Phase 1 — Navigation fix (in flight)
- [~] Fix scroll past projects → about (split _isAnimating flags)

### Phase 2 — Project Detail Pages
- [ ] PROJECT_DETAIL: Clicking a project node opens a full-screen detail overlay
  - Full-width hero image (Unsplash stock, relevant to tech/domain)
  - Longer description with key achievements/metrics
  - Tech stack with icons (devicons CDN)
  - Links section (GitHub, live demo if applicable)
  - Smooth 3D transition: particle title morphs/scatters outward as detail slides in
  - Close button → particles reform, back to project flythrough
  - Images per project:
    - Skyryse: helicopter/aviation (https://images.unsplash.com/photo-1540575467063-178a50c2df87)
    - FCC Simulator: circuit/control room (https://images.unsplash.com/photo-1518770660439-4636190af475)
    - Yolked AI: fitness/gym (https://images.unsplash.com/photo-1517836357463-d25dfeac3438)
    - Amazon SCOT: data/charts (https://images.unsplash.com/photo-1551288049-bebda4e38f71)
    - Build-a-Fair: networking/people (https://images.unsplash.com/photo-1522071820081-009f0129c71c)
    - This Portfolio: creative coding (https://images.unsplash.com/photo-1550745165-9bc0b252726f)

### Phase 3 — Hero Enhancements
- [ ] HERO_BIO: Add a brief tagline line below "SOFTWARE ENGINEER" — styled as particle text or subtle HTML
  - Something like: "Building systems that fly, scale, and think."
- [ ] HERO_LINKS: Subtle GitHub/LinkedIn icon links in hero (bottom-left corner, glass-morphism)

### Phase 4 — About Enhancements  
- [ ] ABOUT_PHOTO: Add a profile photo section (use a placeholder avatar for now — solid colored circle with initials "AS")
- [ ] ABOUT_INTERESTS: Add a brief "Outside of work" section — snowboarding, climbing, Japan

### Phase 5 — Contact Enhancements
- [ ] CONTACT_RESUME: Add a "Download Resume" button (links to a placeholder PDF for now)
- [ ] CONTACT_AVAILABILITY: Add a subtle "Open to opportunities" status badge

### Phase 6 — Polish
- [ ] PERF: Lazy-load MediaPipe/WebGazer (they add ~2MB, shouldn't block initial render)
- [ ] MOBILE: Test and fix mobile layout for project detail overlay
- [ ] SEO: Update meta tags with real description and OG image

## Validator Runs
Log validator verdicts here:
- Run after each Phase completion
