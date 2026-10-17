# queue hop

> hku station · exit a. the lift queue. again.

a white-background, hand-drawn sketch-style, single-button browser game about jumping the exit a lift queue before your 9:00 class.

**[▶ play queue hop](https://ch3ry1y1n9.github.io/queue-hop/)**

---

## how to play

you're stuck in the HKU station exit A lift queue at 8:50. class check-in is 9:00 sharp. reach the front before 8:55.

- **desktop** — press `space` to jump
- **mobile** — tap anywhere to jump

jump over the next person in the queue — but only when they aren't looking. watch for the little red alert doodle above their head: that means they're about to turn around.

---

## the rules

| you see | you do |
|---|---|
| person looking | **don't jump** — caught = −1 position, −1 heart |
| person dozing | easiest to pass, long window |
| person on phone | medium window |
| paranoid person | turns fast, short window |
| station staff | **never jump** — caught = restart |
| floating star | jump it, answer an hku trivia question, skip ahead (max 6 per run) |

you have **3 hearts**. lose all three and it's game over. if the clock hits 8:55 before you reach the front — *"leave home earlier next time."*

---

## modes

- **easy — exit a1 line** — ~65 people ahead, more dozers and distracted people
- **hard — exit a2 line** — ~100 people ahead, more paranoid people and more staff patrols

---

## disclaimer

this game is fictional. please queue properly in real life.

---

## tech

- vanilla html + css + javascript, no build step, no dependencies
- rendered on html5 canvas
- fonts: [gaegu](https://fonts.google.com/specimen/Gaegu) via google fonts
- deployed on github pages
