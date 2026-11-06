
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed. Please try again.");
      }

      localStorage.setItem("divineCaratAdminToken", data.token);

      navigate("/admin", { replace: true });
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to server. Please check whether backend is running."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dc-login">
      <div className="dc-login-decoration dc-login-decoration-one">✧</div>
      <div className="dc-login-decoration dc-login-decoration-two">✦</div>

      <section className="dc-login-container">
        <div className="dc-login-brand">
          <div className="dc-login-symbol">
            <Sparkles size={29} strokeWidth={1.3} />
          </div>

          <h1>DIVINE CARAT</h1>
          <span>THE ART OF THE UNIVERSE</span>
        </div>

        <div className="dc-login-divider">
          <span />
          <Sparkles size={15} />
          <span />
        </div>

        <div className="dc-login-heading">
          <span>WELCOME BACK</span>
          <h2>Admin Studio</h2>
          <p>Sign in to manage your creative universe.</p>
        </div>

        <form onSubmit={handleLogin}>
          <label htmlFor="admin-email">Email Address</label>
          <div className="dc-login-input">
            <Mail size={17} />
            <input
              id="admin-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <label htmlFor="admin-password">Password</label>
          <div className="dc-login-input">
            <Lock size={17} />
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="dc-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {error && <div className="dc-login-error">{error}</div>}

          <button
            type="submit"
            className="dc-login-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ArrowRight size={17} />}
          </button>
        </form>

        <div className="dc-login-bottom">
          <span>✧</span>
          A PRIVATE SPACE FOR DIVINE CARAT
          <span>✧</span>
        </div>

        <button
          type="button"
          className="dc-login-website"
          onClick={() => navigate("/")}
        >
          Back to Website
        </button>
      </section>

      <style>{`
        .dc-login {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          display: grid;
          place-items: center;
          padding: 35px 18px;
          background: #f5f4ed;
          color: #263b31;
          font-family: Georgia, "Times New Roman", serif;
        }

        .dc-login-container {
          width: 100%;
          max-width: 430px;
          padding: 48px 45px 35px;
          background: #fffefa;
          border: 1px solid #e6e3d7;
          box-shadow: 0 18px 60px rgba(35, 57, 44, 0.07);
          position: relative;
          z-index: 1;
        }

        .dc-login-brand {
          text-align: center;
        }

        .dc-login-symbol {
          width: 57px;
          height: 57px;
          margin: 0 auto 17px;
          display: grid;
          place-items: center;
          border: 1px solid #c3a96f;
          border-radius: 50%;
          color: #a58b57;
        }

        .dc-login-brand h1 {
          font-size: 21px;
          font-weight: normal;
          letter-spacing: 4px;
          margin: 0;
        }

        .dc-login-brand > span {
          display: block;
          margin-top: 9px;
          font: 9px Arial, sans-serif;
          letter-spacing: 2.5px;
          color: #a18e66;
        }

        .dc-login-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 32px 0;
          color: #b49a65;
        }

        .dc-login-divider span {
          height: 1px;
          width: 65px;
          background: #e5e1d4;
        }

        .dc-login-heading {
          text-align: center;
          margin-bottom: 29px;
        }

        .dc-login-heading > span {
          font: 9px Arial, sans-serif;
          letter-spacing: 2.5px;
          color: #a58d5c;
        }

        .dc-login-heading h2 {
          font-size: 29px;
          font-weight: normal;
          margin: 11px 0 8px;
        }

        .dc-login-heading p {
          font: 11px Arial, sans-serif;
          color: #8b9185;
          line-height: 1.7;
          margin: 0;
        }

        .dc-login form label {
          display: block;
          margin: 19px 0 9px;
          font: 11px Arial, sans-serif;
          color: #46594b;
        }

        .dc-login-input {
          height: 47px;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 0 13px;
          border: 1px solid #e3e2d8;
          background: #fffefa;
          color: #9a906f;
          transition: border-color .2s;
        }

        .dc-login-input:focus-within {
          border-color: #879a82;
        }

        .dc-login-input input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #263b31;
          font: 12px Arial, sans-serif;
        }

        .dc-login-input input::placeholder {
          color: #a7a99e;
        }

        .dc-password-toggle {
          display: grid;
          place-items: center;
          padding: 3px;
          border: 0;
          background: none;
          color: #899184;
          cursor: pointer;
        }

        .dc-login-submit {
          width: 100%;
          height: 48px;
          margin-top: 28px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          border: 1px solid #203c30;
          background: #203c30;
          color: #f7f2e5;
          font: 11px Arial, sans-serif;
          letter-spacing: 1.5px;
          cursor: pointer;
          transition: .2s;
        }

        .dc-login-submit:hover:not(:disabled) {
          background: #345343;
          border-color: #345343;
        }

        .dc-login-submit:disabled {
          opacity: .65;
          cursor: not-allowed;
        }

        .dc-login-error {
          margin-top: 15px;
          padding: 11px 12px;
          border: 1px solid #e5c9c1;
          background: #fbf1ed;
          color: #9a5143;
          font: 11px Arial, sans-serif;
          line-height: 1.5;
        }

        .dc-login-bottom {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin-top: 28px;
          color: #a09578;
          font: 8px Arial, sans-serif;
          letter-spacing: 1.3px;
          text-align: center;
        }

        .dc-login-bottom span {
          color: #b69b62;
        }

        .dc-login-website {
          display: block;
          margin: 22px auto 0;
          padding: 8px 12px;
          border: 0;
          background: transparent;
          color: #718072;
          font: 11px Arial, sans-serif;
          cursor: pointer;
        }

        .dc-login-website:hover {
          color: #203c30;
          text-decoration: underline;
        }

        .dc-login-decoration {
          position: absolute;
          color: #c4ae7e;
          opacity: .35;
          pointer-events: none;
        }

        .dc-login-decoration-one {
          top: 12%;
          left: 13%;
          font-size: 75px;
        }

        .dc-login-decoration-two {
          bottom: 10%;
          right: 14%;
          font-size: 60px;
        }

        @media (max-width: 480px) {
          .dc-login-container {
            padding: 38px 24px 29px;
          }

          .dc-login-brand h1 {
            font-size: 18px;
          }

          .dc-login-heading h2 {
            font-size: 26px;
          }
        }
      `}</style>
    </main>
  );
}
