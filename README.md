# OTP System Design

![Image](./design/otp-system.png)

# API

- `login`:
  - Step 1: verify username and password
  - Step 2: generate otp and save to cache
- `verify`:
  - check otp from user with otp from cache
