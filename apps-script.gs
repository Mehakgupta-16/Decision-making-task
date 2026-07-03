/**
 * Loss Aversion Experiment — Google Apps Script Web App
 *
 * Paste this into Extensions → Apps Script in your Google Sheet,
 * then Deploy → New deployment → Web app
 *   • Execute as: Me
 *   • Who has access: Anyone
 * Copy the /exec URL it gives you into index.html (GOOGLE_SCRIPT_URL).
 *
 * You do NOT need to add headers manually — the script writes the
 * header row automatically the first time data arrives (empty sheet).
 *
 * One row is written per trial (16 rows per participant); the
 * participant-level and demographic columns repeat on every row so
 * each participant is identifiable by `participantId`.
 */
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data  = JSON.parse(e.postData.contents);
    var d     = data.demographics || {};

    var headers = [
      'participantId', 'timestamp', 'language', 'consent', 'lambda',
      'age', 'gender', 'residence', 'education', 'occupation', 'married', 'earn',
      'selfIncome', 'householdIncome', 'saveRegular', 'saveSatisfy', 'saveGoal',
      'trialNumber', 'gainAmount', 'lossAmount', 'gainLossRatio', 'response',
      'reactionTimeMs', 'boxOrder', 'buttonOrder'
    ];

    // Write the header row automatically on the first submission.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    }

    // One row per trial.
    (data.trials || []).forEach(function(trial) {
      sheet.appendRow([
        data.participantId,
        data.timestamp,
        data.language,
        data.consent,
        data.lambda,
        d.age,
        d.gender,
        d.residence,
        d.education,
        d.occupation,
        d.married,
        d.earn,
        d.selfIncome,
        d.householdIncome,
        d.saveRegular,
        d.saveSatisfy,
        d.saveGoal,
        trial.trialNumber,
        trial.gainAmount,
        trial.lossAmount,
        trial.gainLossRatio,
        trial.response,
        trial.reactionTimeMs,
        trial.boxOrder,
        trial.buttonOrder
      ]);
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
