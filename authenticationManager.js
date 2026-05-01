// authenticationManager.js
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

class AuthenticationManager {
  // Registro de usuario
  static async register(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Login de usuario
  static async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Obtener usuario actual (si tienes un token de sesión)
  static async getUser(access_token) {
    const { data, error } = await supabase.auth.getUser(access_token);

    if (error) {
      throw new Error(error.message);
    }

    return data.user;
  }
}

module.exports = AuthenticationManager;
