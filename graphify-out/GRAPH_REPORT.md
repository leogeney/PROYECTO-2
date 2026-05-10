# Graph Report - .  (2026-05-09)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 142 nodes · 229 edges · 10 communities (9 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0ef66ba4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]

## God Nodes (most connected - your core abstractions)
1. `useProgress()` - 15 edges
2. `LessonRunner()` - 7 edges
3. `ResultScreen()` - 5 edges
4. `XpBar()` - 4 edges
5. `T` - 4 edges
6. `ScoreBadge()` - 4 edges
7. `DashboardLayout()` - 3 edges
8. `useLogin()` - 3 edges
9. `auth` - 3 edges
10. `MODULES` - 3 edges

## Surprising Connections (you probably didn't know these)
- `ResultScreen()` --calls--> `useProgress()`  [EXTRACTED]
  src/games/GameShared.jsx → src/context/ProgressContext.jsx
- `LessonRunner()` --calls--> `useProgress()`  [EXTRACTED]
  src/lessons/LessonShared.jsx → src/context/ProgressContext.jsx
- `DashboardLayout()` --calls--> `useProgress()`  [EXTRACTED]
  src/components/layout/DashboardLayout.jsx → src/context/ProgressContext.jsx
- `Login()` --calls--> `useLogin()`  [EXTRACTED]
  src/components/Login/Login.jsx → src/components/Login/useLogin.js
- `XpBar()` --calls--> `useProgress()`  [EXTRACTED]
  src/components/ui/XpBar.jsx → src/context/ProgressContext.jsx

## Communities (10 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.11
Nodes (19): ProgressContext, ProgressProvider(), useProgress(), DashboardLayout(), NAV_ITEMS, DashboardStyles(), PageHome(), GOALS (+11 more)

### Community 1 - "Community 1"
Cohesion: 0.1
Nodes (10): app, auth, firebaseConfig, googleProvider, C, inp, Login(), useLogin() (+2 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (15): Lives(), ProgressBar(), ResultScreen(), ScoreBadge(), T, LEVELS, MEMORY_SIGNS, MemoryMatch() (+7 more)

### Community 3 - "Community 3"
Cohesion: 0.17
Nodes (13): MODULES, Lesson1(), QUESTIONS, Lesson2(), QUESTIONS, Lesson3(), QUESTIONS, Lesson4() (+5 more)

### Community 4 - "Community 4"
Cohesion: 0.13
Nodes (12): AchievementsContext, AchievementsProvider(), useAchievements(), DIFFICULTY_LEVELS, GameHub(), GameHubInner(), GAMES_CONFIG, GameStyles() (+4 more)

### Community 6 - "Community 6"
Cohesion: 0.47
Nodes (4): PageBiblioteca(), T, SIGN_CATEGORIES, SIGNS_DB

## Knowledge Gaps
- **30 isolated node(s):** `T`, `T`, `NAV_ITEMS`, `C`, `inp` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useProgress()` connect `Community 0` to `Community 2`, `Community 3`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Why does `AchievementsProvider()` connect `Community 4` to `Community 1`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `ResultScreen()` connect `Community 2` to `Community 0`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `T`, `T`, `NAV_ITEMS` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._