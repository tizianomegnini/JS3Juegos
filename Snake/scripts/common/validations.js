/**
 * validations.js
 * Módulo de validaciones de formularios en tiempo real.
 * Todas las validaciones se ejecutan mientras el usuario escribe (oninput).
 */

// ─── Reglas de validación ──────────────────────────────────────────────────

/**
 * Valida que un nombre sólo contenga letras, espacios y apóstrofes.
 * @param {string} value
 * @returns {string|null} Mensaje de error o null si es válido
 */
export function validateName(value) {
  const trimmed = value.trim();
  if (!trimmed)                                      return "El nombre no puede estar vacío.";
  if (trimmed.length < 2)                            return "El nombre debe tener al menos 2 caracteres.";
  if (trimmed.length > 30)                           return "El nombre no puede superar los 30 caracteres.";
  if (/[0-9]/.test(trimmed))                         return "El nombre no puede contener números.";
  if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ' ]/.test(trimmed))   return "Solo se permiten letras y apóstrofes (').";
  return null;
}

// ─── Helpers de UI para validaciones ──────────────────────────────────────

/**
 * Muestra o limpia el error de un campo.
 * @param {HTMLElement} input - El campo de entrada
 * @param {string|null} errorMsg - Mensaje de error o null para limpiar
 */
export function setFieldError(input, errorMsg) {
  const errorEl = document.getElementById(`${input.id}-error`);

  if (errorMsg) {
    input.classList.add("is-invalid");
    input.classList.remove("is-valid");
    if (errorEl) {
      errorEl.textContent = errorMsg;
      errorEl.classList.add("visible");
    }
  } else {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.classList.remove("visible");
    }
  }
}

/**
 * Limpia el estado de validación de un campo (lo pone neutro).
 * @param {HTMLElement} input
 */
export function clearFieldState(input) {
  const errorEl = document.getElementById(`${input.id}-error`);
  input.classList.remove("is-invalid", "is-valid");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.classList.remove("visible");
  }
}

/**
 * Adjunta validación en tiempo real a un campo de nombre de jugador.
 * Se dispara en el evento "input".
 * @param {HTMLElement} input
 * @param {Function} [extraValidator] - Validación adicional opcional
 */
export function attachNameValidation(input, extraValidator = null) {
  input.addEventListener("input", () => {
    const error = validateName(input.value) ?? (extraValidator ? extraValidator(input.value) : null);
    if (input.value === "") {
      clearFieldState(input);
    } else {
      setFieldError(input, error);
    }
  });
}

/**
 * Ejecuta todas las validaciones de un formulario antes de enviarlo.
 * @param {HTMLElement[]} inputs - Array de campos a validar
 * @param {Function[]} validators - Array de funciones validadoras (misma posición que inputs)
 * @returns {boolean} true si todo es válido
 */
export function validateForm(inputs, validators) {
  let valid = true;
  inputs.forEach((input, i) => {
    const error = validators[i](input.value);
    setFieldError(input, error);
    if (error) valid = false;
  });
  return valid;
}   