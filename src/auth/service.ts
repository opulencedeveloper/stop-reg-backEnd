import User from "../user/entity";
import { IOTP } from "../utils/interface";

class AuthService {
  public async validateOtp(email: string, otp: string) {
    console.log(email, otp);
    const otpValidity = await User.findOne({
      email: email,
      emailVerificationOtp: otp,
    });

    return otpValidity;
  }

  public async verifyEmail(email: string) {
    let user = await User.findOne({ email });

    if (user) {
      user.emailVerified = true;
      user.emailVerificationOtp = undefined;
      user.emailVerificationOtpExpiration = undefined;
      user = await user.save();
    }

    return user;
  }

  public async saveOtp(input: IOTP) {
    const { otp, email } = input;

    const user = await User.findOne({
      email: email,
    });

    user!.emailVerificationOtp = otp;
    user!.emailVerificationOtpExpiration = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    await user!.save();

    return user;
  }

  public async checkEmailVerificationStatus(email: string) {
    const user = await User.findOne({ email, emailVerified: true });
    return user;
  }
}

export const authService = new AuthService();
