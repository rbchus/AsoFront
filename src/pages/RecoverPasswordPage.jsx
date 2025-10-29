// src/pages/RecoverPasswordPage.jsx
import React, { useState } from "react";
import { forgotPassword } from "../services/authService";

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(null);
  const [step, setStep] = useState(1);
  const [token, setToken] = useState("");
  const [newPass, setNewPass] = useState("");

  const submitEmail = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setMsg("Se envió un correo con instrucciones (si el email existe).");
      setStep(2);
    } catch (error) {
      setMsg(error.response?.data?.message || "Error enviando email.");
    }
  };

  /* const submitReset = async (e) => {
    e.preventDefault();
    try {
      await resetPassword({ token, newPassword: newPass });
      setMsg("Contraseña restablecida. Ahora puedes iniciar sesión.");
      setStep(3);
    } catch (error) {
      setMsg(error.response?.data?.message || "Error al restablecer.");
    }
  }; */

  return (
    <div className="center-screen">
      <div className="card" style={{ maxWidth: 480 }}>
        <h2>Recuperar contraseña</h2>
        {step === 1 && (
          <form onSubmit={submitEmail}>
            <label>
              Correo
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <button type="submit">Enviar instrucciones</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={submitReset}>
            <p>Introduce el token del correo y tu nueva contraseña</p>
            <label>
              Token
              <input value={token} onChange={(e) => setToken(e.target.value)} />
            </label>
            <label>
              Nueva contraseña
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                required
              />
            </label>
            <button type="submit">Restablecer contraseña</button>
          </form>
        )}

        {step === 3 && (
          <div>
            <p>Contraseña cambiada con éxito. <a href="/login">Ir a login</a></p>
          </div>
        )}

        {msg && <p className="mt-2">{msg}</p>}
      </div>
    </div>
  );
}
