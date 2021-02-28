const otpGen = (): string => {
  const digits = '0123456789';

    const otpLength = 4;

    let otp = '';

    for (let i=1; i<=otpLength; i += 1)

    {

        const index = Math.floor(Math.random()*(digits.length));

        otp += digits[index];

    }

    return otp;
}

export default otpGen;