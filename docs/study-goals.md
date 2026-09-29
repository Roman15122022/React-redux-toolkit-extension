# Study goals

Open **Settings → Study goals** to create, edit, disable, or delete targets.
You can have one daily total, one weekly total, and weekly goals for different
activities. Disabling keeps a target available to re-enable; deleting removes it.
The daily target starts at 60 minutes and existing daily settings are preserved.

Only completed timer sessions contribute to progress. Pausing, resuming, or
canceling a timer does not complete a target. Popup and Side Panel show daily
and weekly totals; Statistics and History show activity progress and the weekly
plan. History's goal summary always refers to today and the current week,
independently of the history filter.

Weeks run Monday–Sunday in your current local timezone. A session belongs to
the date it finishes, including sessions crossing midnight. Changing timezones
regroups the locally saved sessions by their completion timestamps.

Activity names are case-sensitive. Renaming an activity target keeps its old
name as an alias, so previous sessions still count. Existing logs are not
rewritten. Different targets cannot share the same activity name or alias.

In **Planning limits**, choose study days and the maximum workload in minutes
per day. The default limit is 180 minutes. Today's completed study time uses
part of that limit. The planner spreads remaining weekly goals across available
days, using recent workload as a recommendation and your configured maximum as
a hard limit. Activity time also counts toward the total target, without being
scheduled twice. Time that cannot fit is shown as an unfinished remainder.
No selected days means no time can be scheduled.

Streaks count study days rather than target-completion days and forgive one
missed day per streak. The next streak milestone is 7, 14, or 30 days. A newly
completed time target is acknowledged in the session report; reopening history
or reloading the extension does not repeat the completion message.

Configuration is saved locally and synchronized between extension pages. Full
backup replacement applies imported goals; merging history preserves current
goals and planning limits. Older backups use their saved daily target or the
60-minute default. Resetting statistics clears progress and streaks but keeps
goal configuration. Calculations use the available saved history, which has
the extension's existing session-retention limit.
