### Technical Challenge: Runtime URL Encoding Error
**Date:** Day 3
**Issue:** The application crashed with a `SyntaxError` whenever a user tried to share their results to X (Twitter).
**Root Cause:** The `twitterUrl` string was improperly constructed using literal curly braces `{}` instead of JavaScript template literal placeholders `${}`. This caused the browser to attempt to navigate to an invalid character string, which is forbidden in URL headers.
**Resolution:** 
1. Switched to backtick syntax with proper `${encodeURIComponent()}` wrappers.
2. Verified that all reserved characters (spaces, emojis, and slashes) were safely converted to URI-safe strings.
3. Added a fallback mechanism to detect `window.location.origin` for dynamic URL generation.
