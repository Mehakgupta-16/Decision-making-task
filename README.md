# Loss Aversion Task

A simple guide to understanding how this experiment works, what data it collects, and how the result is calculated.

---

## 1. What is Loss Aversion?

Loss Aversion is a well-known finding in behavioural economics. It means that for most people, **losing money hurts more than an equivalent gain feels good**.

For example, losing ₹200 typically feels about twice as bad as winning ₹200 feels good. This asymmetry was famously measured by psychologists Daniel Kahneman and Amos Tversky (1979), who found that on average people feel losses roughly **2 to 2.5 times more strongly** than equivalent gains.

We capture this individual difference with a single number called **Lambda (λ)**.

---

## 2. How does the task Work?

The participant faces **16 coin-toss gambles**, one at a time. For each gamble:

- A fair coin is imagined to be tossed.
- **Heads → win** a certain amount (the Gain).
- **Tails → lose** a certain amount (the Loss).
- The participant clicks **Accept** (willing to play) or **Reject** (not willing).

The 16 gambles are all combinations of four Gain amounts and four Loss amounts:

| Gain \ Loss | −₹100 | −₹200 | −₹300 | −₹400 |
|-------------|-------|-------|-------|-------|
| **+₹100**   | Trial | Trial | Trial | Trial |
| **+₹200**   | Trial | Trial | Trial | Trial |
| **+₹300**   | Trial | Trial | Trial | Trial |
| **+₹400**   | Trial | Trial | Trial | Trial |

The order of trials is **randomised** for every participant so that patterns cannot emerge from sequence effects.

---

## 3. Application Flow (Screen by Screen)

1. **Language Selection** — Participant chooses English or Hindi.
2. **Instructions** — Explains the coin-toss task. Participant clicks "Start Experiment".
3. **16 Trials** — Each gamble is shown one at a time. A dot-based progress bar at the top shows how many trials remain. The position of Gain/Loss boxes and Accept/Reject buttons is randomly swapped each trial to prevent response-side bias.
4. **Demographics** — Participant enters their Age, Gender, and Monthly Income. A unique Participant ID is auto-generated in the background.
5. **Results** — The participant's personal λ is displayed along with an interpretation of what the score means.

---

## 4. What Data is Collected?

For each of the 16 trials, the app silently records:

| Field | Description |
|---|---|
| `participantId` | Auto-generated unique ID (timestamp + random string) |
| `trialNumber` | 1–16 |
| `gainAmount` | ₹100, ₹200, ₹300, or ₹400 |
| `lossAmount` | ₹100, ₹200, ₹300, or ₹400 |
| `gainLossRatio` | Gain ÷ Loss (reference value) |
| `response` | `"accept"` or `"reject"` |
| `reactionTimeMs` | Milliseconds from trial display to button click |
| `boxOrder` | Whether Gain or Loss box appeared on the left |
| `buttonOrder` | Whether Accept or Reject appeared on the left |

All 16 trial rows plus demographic information are sent together to a **Google Sheet** via a Google Apps Script Web App when the participant submits the Demographics form.

---

## 5. How is Lambda (λ) Calculated?

Lambda is estimated using **logistic regression** on the participant's 16 responses.

**Step 1 — Build the model:**

```
P(Accept) = sigmoid( β₀ + β_gain × Gain + β_loss × Loss )
```

We fit this model to the participant's data using gradient descent. The result is two key numbers:

- **β_gain** — how much each additional rupee of gain increases the probability of accepting. This value will be *positive*.
- **β_loss** — how much each additional rupee of loss decreases the probability of accepting. This value will be *negative*.

**Step 2 — Compute Lambda:**

```
λ = −( β_loss / β_gain )
```

Because β_loss is negative, the minus sign makes λ a positive number. Intuitively, λ tells you: *"How many rupees of gain would this person need to offset one rupee of potential loss?"*

**Step 3 — Interpret the score:**

| λ value | What it means |
|---|---|
| ≤ 1.0 | Loss-neutral — gains and losses feel roughly equal. |
| 1.0 – 1.5 | Mildly loss-averse — losses sting slightly more than gains. |
| 1.5 – 2.5 | Moderately loss-averse — typical range for most people. |
| 2.5 – 3.5 | Strongly loss-averse — very sensitive to potential losses. |
| > 3.5 | Very strongly loss-averse — avoids almost all risk. |

---

## 6. Technical Notes

- The entire app is a **single HTML file** (`index.html`) — no server, no database, no installation needed.
- It works on **mobile phones and desktops** (mobile-first responsive design).
- The app supports **English and Hindi**. Language strings are written in a JSON dictionary at the top of the JavaScript — easy to edit.
- Data is sent via a **POST request** to a Google Apps Script Web App URL which writes one row per trial into a Google Sheet.
- A unique Participant ID is auto-generated from a timestamp and random string at the start of each session.
- All randomisations (trial order, box placement, button order) happen fresh each time the experiment is started.

---

*Loss Aversion Experiment — Cognitive Psychology Research Tool — 2026*
