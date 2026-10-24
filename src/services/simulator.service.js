let distance = 20;
let motorState = "DETENIDO";
let mode = "AUTOMATICO";
let lastCommand = "DETENIDO";
// Rangos del modo automático (mismos valores que el sketch)
const AUTO_MIN_CM = 15;    // desde aquí: DERECHA
const AUTO_SPLIT_CM = 25;  // desde aquí: IZQUIERDA
const AUTO_MAX_CM = 40;    // hasta aquí: IZQUIERDA

function getDistance() {
  // Simula pequeñas variaciones de un sensor real.
  distance = Math.max(
    5,
    Math.min(60, distance + (Math.random() * 4 - 2))
  );

  return Number(distance.toFixed(1));
}

function getAutomaticMotorState(cm) {
  if (cm >= AUTO_MIN_CM && cm < AUTO_SPLIT_CM) {
    return "DERECHA";
  }

  if (cm >= AUTO_SPLIT_CM && cm <= AUTO_MAX_CM) {
    return "IZQUIERDA";
  }

  return "DETENIDO";
}

function getStatus() {
  const currentDistance = getDistance();

  if (mode === "AUTOMATICO") {
    motorState = getAutomaticMotorState(currentDistance);
    lastCommand = motorState;
  }

  return {
    success: true,
    mode,
    distanceCm: currentDistance,
    motorState,
    lastCommand,
    simulated: true,
    timestamp: new Date().toISOString()
  };
}

function setMode(newMode) {
  if (!["AUTOMATICO", "MANUAL"].includes(newMode)) {
    throw new Error("Modo no válido");
  }

  mode = newMode;

  if (mode === "AUTOMATICO") {
    motorState = getAutomaticMotorState(distance);
    lastCommand = motorState;
  } else {
    motorState = "DETENIDO";
    lastCommand = "DETENIDO";
  }

  return getStatus();
}

function executeCommand(command) {
  if (mode !== "MANUAL") {
    throw new Error(
      "Cambia al modo MANUAL antes de enviar comandos."
    );
  }

  const commands = {
    IZQUIERDA: "IZQUIERDA",
    DERECHA: "DERECHA",
    DETENIDO: "DETENIDO"
  };

  if (!commands[command]) {
    throw new Error("Comando no válido");
  }

  motorState = commands[command];
  lastCommand = command;

  return getStatus();
}

module.exports = {
  getStatus,
  setMode,
  executeCommand
};
