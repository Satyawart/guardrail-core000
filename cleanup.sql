
-- COPY AND PASTE THIS SQL TO CLEANUP LIVE-QA USERS:
DELETE FROM auth.users WHERE email IN ('live-qa-a-1788605364042@test.com', 'live-qa-b-1788605364042@test.com', 'live-qa-hacker-1788605364042@test.com');
