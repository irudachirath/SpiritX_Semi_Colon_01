import React, { useEffect, useState } from "react";
import "./LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";

const LoginForm = () => {
  const API_BASE_URL = "http://localhost:5000/auth";
  // --------------- STATE VARIABLES ---------------
  // General states for toggling forms and login status
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Signup form states
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState(""); // Authentication-related errors above the CTA
  const [signupUsernameError, setSignupUsernameError] = useState("");
  const [signupPasswordError, setSignupPasswordError] = useState("");
  const [signupConfirmPasswordError, setSignupConfirmPasswordError] =
    useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  const [loadingSignup, setLoadingSignup] = useState(false);

  // Login form states
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState(""); // Authentication-related errors above the CTA
  const [loginUsernameError, setLoginUsernameError] = useState("");
  const [loginPasswordError, setLoginPasswordError] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);

  // For signup success confirmation
  const [showSignupConfirmation, setShowSignupConfirmation] = useState(false);

  // --------------- HELPER FUNCTIONS ---------------

  // Reads the user list from localStorage
  const getStoredUsers = () => {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  };

  // Saves updated user list to localStorage
  const storeUsers = (users) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  // Returns a number from 0 to 100
  const calculatePasswordStrength = (pw) => {
    let strengthCount = 0;
    const hasUppercase = /[A-Z]/.test(pw);
    const hasLowercase = /[a-z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(pw);
    const hasMinLength = pw.length >= 8;

    if (hasUppercase) strengthCount++;
    if (hasLowercase) strengthCount++;
    if (hasNumber) strengthCount++;
    if (hasSpecialChar) strengthCount++;
    if (hasMinLength) strengthCount++;

    // Convert strengthCount (0 to 5) into a percentage scale (0-100)
    switch (strengthCount) {
      case 0:
        return 0;
      case 1:
        return 20; // Very Weak
      case 2:
        return 40; // Weak
      case 3:
        return 60; // Fair
      case 4:
        return 80; // Strong
      case 5:
        return 100; // Very Strong
      default:
        return 0;
    }
  };

  const getBarColor = (val) => {
    if (val <= 20) return "red"; // Very Weak
    if (val <= 40) return "orange"; // Weak
    if (val <= 60) return "gold"; // Fair
    if (val <= 80) return "lightblue"; // Strong
    return "lightgreen"; // Very Strong
  };

  // Check password complexity with the requirements
  // (At least one lowercase, one uppercase, one special character, 8 chars total)
  const validatePasswordComplexity = (pw) => {
    const errors = [];

    if (pw.length < 8) {
      errors.push("* Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(pw)) {
      errors.push("* Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(pw)) {
      errors.push("* Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(pw)) {
      errors.push("* Password must contain at least one number (0-9)");
    }
    if (!/[^A-Za-z0-9]/.test(pw)) {
      errors.push(
        "* Password must contain at least one special character (e.g., @, $, !)"
      );
    }
    return errors;
  };

  // --------------- SIGNUP HANDLERS ---------------

  // Real-time username validation
  const handleSignupUsernameChange = (e) => {
    const value = e.target.value;
    setSignupUsername(value);
    setSignupError("");

    // Min length check (8 chars)
    if (!value) {
      setSignupUsernameError("* Username is required");
    } else if (value.length < 8) {
      setSignupUsernameError("* Username must be at least 8 characters");
    } else {
      setSignupUsernameError("");
    }
  };

  // Real-time password validation
  const handleSignupPasswordChange = (e) => {
    const value = e.target.value;
    setSignupPassword(value);
    setSignupError("");

    // Evaluate complexity
    const complexityErrors = validatePasswordComplexity(value);
    if (complexityErrors.length > 0) {
      setSignupPasswordError(complexityErrors[0]); // Show just the first
    } else {
      setSignupPasswordError("");
    }

    // Update password strength indicator
    setPasswordStrength(calculatePasswordStrength(value));

    // Also re-validate confirm password if the user typed it already
    if (signupConfirmPassword && signupConfirmPassword !== value) {
      setSignupConfirmPasswordError("* Passwords do not match");
    } else {
      setSignupConfirmPasswordError("");
    }
  };

  // Real-time confirm password validation
  const handleSignupConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setSignupConfirmPassword(value);
    setSignupError("");

    if (!value) {
      setSignupConfirmPasswordError("* Confirm Password is required");
    } else if (value !== signupPassword) {
      setSignupConfirmPasswordError("* Passwords do not match");
    } else {
      setSignupConfirmPasswordError("");
    }
  };

  // --------------- LOGIN HANDLERS ---------------

  const handleLoginUsernameChange = (e) => {
    const value = e.target.value;
    setLoginUsername(value);
    setLoginError("");

    if (!value) {
      setLoginUsernameError("* Username is required");
    } else if (value.length < 8) {
      setLoginUsernameError("* Username must be at least 8 characters");
    } else {
      setLoginUsernameError("");
    }
  };

  const handleLoginPasswordChange = (e) => {
    const value = e.target.value;
    setLoginPassword(value);
    setLoginError("");

    // We can check complexity just like signup
    const complexityErrors = validatePasswordComplexity(value);
    if (complexityErrors.length > 0) {
      setLoginPasswordError(complexityErrors[0]);
    } else {
      setLoginPasswordError("");
    }
  };

  // --------------- CHECK SESSION ---------------
  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
  };

  // Signup handler
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setSignupError(""); // Clear authentication-level errors

    // Basic field checks
    if (!signupUsername || !signupPassword || !signupConfirmPassword) {
      if (!signupUsername) setSignupUsernameError("* Username is required");
      if (!signupPassword) setSignupPasswordError("* Password is required");
      if (!signupConfirmPassword)
        setSignupConfirmPasswordError("* Confirm Password is required");
      return;
    }

    // If any field-level error is still present, don't proceed
    if (
      signupUsernameError ||
      signupPasswordError ||
      signupConfirmPasswordError
    ) {
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setSignupError("Passwords do not match.");
      setLoadingSignup(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: signupUsername,
          password: signupPassword,
          confirmPassword: signupConfirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSignupSuccess("Signup successful! Redirecting to login...");
        setTimeout(() => {
          setIsSignUp(false);
          setSignupUsername("");
          setSignupPassword("");
          setSignupConfirmPassword("");
        }, 2000);
      } else {
        setSignupError(data.error || "Signup failed. Try again.");
      }
    } catch (error) {
      setSignupError("Error connecting to the server.");
    } finally {
      setLoadingSignup(false);
    }
  };

  // Login handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    // Check empty fields
    if (!loginUsername || !loginPassword) {
      if (!loginUsername) setLoginUsernameError("* Username is required");
      if (!loginPassword) setLoginPasswordError("* Password is required");
      return;
    }

    // If any field-level error is still present, don't proceed
    if (loginUsernameError || loginPasswordError) {
      return;
    }

    setLoadingLogin(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", loginUsername);
        setIsLoggedIn(true);
      } else {
        setLoginError(data.message || "Invalid credentials.");
      }
    } catch (error) {
      setLoginError("Error connecting to the server.");
    } finally {
      setLoadingLogin(false);
    }
  };

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  if (isLoggedIn) {
    return (
      <div className="landing-page">
        <h1>Welcome, {localStorage.getItem("username")}!</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  // --------------- RENDER SIGNUP & LOGIN FORMS ---------------
  return (
    <div className="wrapper">
      {/* ----------- SIGNUP FORM ----------- */}
      {isSignUp && (
        <div className="form-box-signup">
          <form onSubmit={handleSignUpSubmit}>
            <h1>Sign Up</h1>

            {/* Display a confirmation dialog if signup is successful */}
            {showSignupConfirmation && (
              <div className="confirmation-dialog">
                <p>Signup successful! Redirecting to login...</p>
              </div>
            )}

            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                value={signupUsername}
                onChange={handleSignupUsernameChange}
              />
              <FaUser className="icon" />
            </div>
            {signupUsernameError && (
              <p className="error-message">{signupUsernameError}</p>
            )}

            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                value={signupPassword}
                onChange={handleSignupPasswordChange}
              />
              <FaLock className="icon" />
            </div>
            {/* Password strength indicator */}
            {signupPassword && (
              <div className="password-strength-container">
                <div
                  className="password-strength-bar"
                  style={{
                    width: `${passwordStrength}%`,
                    backgroundColor: getBarColor(passwordStrength),
                  }}
                />
              </div>
            )}

            {signupPasswordError && (
              <p className="error-message">{signupPasswordError}</p>
            )}

            <div className="input-box">
              <input
                type="password"
                placeholder="Confirm Password"
                value={signupConfirmPassword}
                onChange={handleSignupConfirmPasswordChange}
              />
              <FaLock className="icon" />
            </div>
            {signupConfirmPasswordError && (
              <p className="error-message">{signupConfirmPasswordError}</p>
            )}

            {/* Authentication error above CTA button */}
            {signupError && (
              <div className="error-message auth-error">{signupError}</div>
            )}

            <button type="submit" disabled={showSignupConfirmation}>
              Sign Up
            </button>
            <p>
              Already have an account?{" "}
              <a href="#" onClick={() => setIsSignUp(false)}>
                Login
              </a>
            </p>
          </form>
        </div>
      )}

      {/* ----------- LOGIN FORM ----------- */}
      {!isSignUp && (
        <div className="form-box-login">
          <form onSubmit={handleLoginSubmit}>
            <h1>Login</h1>

            {/* Authentication error above CTA button */}
            {loginError && (
              <div className="error-message auth-error">{loginError}</div>
            )}

            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                value={loginUsername}
                onChange={handleLoginUsernameChange}
              />
              <FaUser className="icon" />
            </div>
            {loginUsernameError && (
              <p className="error-message">{loginUsernameError}</p>
            )}

            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={handleLoginPasswordChange}
              />
              <FaLock className="icon" />
            </div>

            <button type="submit">Login</button>
            <p>
              Don't have an account?{" "}
              <a href="#" onClick={() => setIsSignUp(true)}>
                Sign Up
              </a>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
