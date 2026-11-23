// GASBOUND // multi-stage gas-law research campaign.

const STORAGE_KEY = "gasbound_progress_v2";
const UNITS = { P: "kPa", V: "L", T: "K", n: "mol" };
const VARIABLE_NAMES = { P: "PRESSURE", V: "VOLUME", T: "TEMPERATURE", n: "AMOUNT OF GAS" };
const LAWS = {
  orientation: { name: "Experimental Orientation", equation: "P, V, T, n", description: "These measurements describe a gas sample. Pressure is in kPa, volume in liters, temperature in kelvin, and amount in moles." },
  boyle: { name: "Boyle's Law", equation: "P₁V₁ = P₂V₂", description: "At constant temperature and amount of gas, pressure rises as volume decreases." },
  charles: { name: "Charles's Law", equation: "V₁/T₁ = V₂/T₂", description: "At constant pressure and amount of gas, volume changes in direct proportion to absolute temperature (kelvin)." },
  gayLussac: { name: "Gay-Lussac's Law", equation: "P₁/T₁ = P₂/T₂", description: "At constant volume and amount of gas, pressure changes in direct proportion to absolute temperature (kelvin)." },
  avogadro: { name: "Avogadro's Law", equation: "V₁/n₁ = V₂/n₂", description: "At constant temperature and pressure, volume changes in direct proportion to the amount of gas." },
  combined: { name: "Combined Gas Law", equation: "(P₁V₁)/T₁ = (P₂V₂)/T₂", description: "For a fixed amount of gas, pressure, volume, and kelvin temperature change together according to this relationship." },
  ideal: { name: "Ideal Gas Law", equation: "PV = nRT", description: "The ideal gas model relates pressure, volume, amount, and kelvin temperature. Here R = 8.314 kPa·L/(mol·K)." }
};

function challenge(law, title, prompt, initial, control, controlTarget, observed, options) {
  const ranges = {
    P: { min: 20, max: 400, step: 5 },
    V: { min: 0.5, max: 12, step: 0.1 },
    T: { min: 150, max: 700, step: 5 },
    n: { min: 0.1, max: 5, step: 0.1 }
  };
  return {
    law, title, prompt, initial, control, controlTarget, observed,
    min: ranges[control].min, max: ranges[control].max, step: ranges[control].step,
    ...(options || {})
  };
}

const STAGES = [
  {
    title: "Orientation", code: "00", environment: "INSTRUMENTATION BAY",
    heading: "Learn the instruments.", short: "Controls & Measurements",
    intro: "Welcome to GASBOUND. Pressure is force per area (kPa), volume is the space a gas occupies (L), temperature is measured in kelvin (K), and n is amount of gas (mol). Move the slider, watch the live readouts, then enter the requested measurement.",
    completion: "You can read the chamber and operate its controls. Gas-law calculations use kelvin, liters, kilopascals, and moles.",
    challenges: [
      challenge("boyle", "01 / Read the pressure gauge", "Compress the 4.0 L sample to 3.0 L. What pressure should the gauge show?", { P: 100, V: 4, T: 300, n: 1 }, "V", 3, "P"),
      challenge("charles", "02 / Temperature is Kelvin", "Warm the sample from 300 K to 360 K. What volume will it occupy at constant pressure?", { P: 100, V: 4, T: 300, n: 1 }, "T", 360, "V"),
      challenge("avogadro", "03 / Track the gas sample", "Increase the amount from 1.0 mol to 1.5 mol at constant pressure and temperature. What volume should the chamber read?", { P: 100, V: 4, T: 300, n: 1 }, "n", 1.5, "V")
    ]
  },
  {
    title: "Pressure Breach", code: "01", environment: "ATMOSPHERIC CONTROL BAY",
    heading: "Stabilize the pressure breach.", short: "Boyle's Law",
    intro: "A sealed sample begins at 100 kPa and 4.0 L. Use the piston to change volume and contain the breach. Temperature and amount of gas remain constant.",
    completion: "Boyle's Law describes an inverse relationship: when a fixed gas sample is squeezed into less space at constant temperature, its pressure rises.",
    challenges: [
      challenge("boyle", "01 / Basic pressure-volume relationship", "Compress the sample to 2.0 L. What pressure will the chamber reach?", { P: 100, V: 4, T: 300, n: 1 }, "V", 2, "P"),
      challenge("boyle", "02 / Calculate the resulting pressure", "Set the volume to 2.5 L. Calculate the resulting pressure.", { P: 100, V: 4, T: 300, n: 1 }, "V", 2.5, "P"),
      challenge("boyle", "03 / Calculate final volume", "Raise pressure to 180 kPa. Calculate the volume needed to keep the sample stable.", { P: 90, V: 4, T: 300, n: 1 }, "P", 180, "V"),
      challenge("boyle", "04 / Environmental pressure lock", "The airlock opens at 240 kPa. Set the chamber to that pressure and enter the required volume.", { P: 120, V: 3, T: 300, n: 1 }, "V", 1.5, "P", { environment: "AIRLOCK PRESSURE SEAL" })
    ]
  },
  {
    title: "Thermal Run", code: "02", environment: "THERMAL REGULATION LAB",
    heading: "Bring the volume into range.", short: "Charles's Law",
    intro: "The thermal regulator changes absolute temperature while the chamber maintains constant pressure. Keep temperature in kelvin; never substitute Celsius in a gas-law ratio.",
    completion: "Charles's Law: with pressure and amount fixed, a gas expands as its kelvin temperature rises and contracts as it cools.",
    challenges: [
      challenge("charles", "01 / Controlled expansion", "Heat the sample from 300 K to 450 K. What final volume will it reach?", { P: 100, V: 4, T: 300, n: 1 }, "T", 450, "V"),
      challenge("charles", "02 / Cooling cycle", "Cool the sample to 240 K at constant pressure. Calculate its final volume.", { P: 100, V: 5, T: 300, n: 1 }, "T", 240, "V"),
      challenge("charles", "03 / Environmental clearance", "The sensor array needs a 4.5 L volume. Adjust the gas and calculate its temperature in kelvin.", { P: 100, V: 3, T: 300, n: 1 }, "V", 4.5, "T", { environment: "CRYO-SENSOR ARRAY" })
    ]
  },
  {
    title: "Pressure Furnace", code: "03", environment: "SEALED THERMAL FURNACE",
    heading: "Regulate the sealed chamber.", short: "Gay-Lussac's Law",
    intro: "A rigid vessel cannot change volume. Heat or cool the sealed gas to control pressure; the amount of gas and volume stay constant.",
    completion: "Gay-Lussac's Law: at fixed volume and amount, raising the kelvin temperature raises pressure in the same proportion.",
    challenges: [
      challenge("gayLussac", "01 / Heat under pressure", "Raise the sealed gas to 450 K. What pressure will the gauge show?", { P: 100, V: 4, T: 300, n: 1 }, "T", 450, "P"),
      challenge("gayLussac", "02 / Cooling pressure relief", "Cool the vessel to 240 K. Calculate the new pressure.", { P: 100, V: 4, T: 300, n: 1 }, "T", 240, "P"),
      challenge("gayLussac", "03 / Furnace release valve", "The release valve is calibrated for 135 kPa. Set that pressure and calculate the required kelvin temperature.", { P: 90, V: 4, T: 300, n: 1 }, "P", 135, "T", { environment: "FURNACE RELEASE VALVE" })
    ]
  },
  {
    title: "Molecule Feed", code: "04", environment: "GAS INTAKE ARRAY",
    heading: "Balance the molecule feed.", short: "Avogadro's Law",
    intro: "Meter gas into the chamber without changing its temperature or pressure. The number of moles tracks the chamber volume directly.",
    completion: "Avogadro's Law: when temperature and pressure are held steady, adding more gas increases its volume in the same proportion.",
    challenges: [
      challenge("avogadro", "01 / Double the sample", "Feed 2.0 mol into the chamber. What volume is required at constant pressure and temperature?", { P: 100, V: 4, T: 300, n: 1 }, "n", 2, "V"),
      challenge("avogadro", "02 / Calibrated feed", "Set the gas amount to 1.5 mol. Calculate the resulting volume.", { P: 100, V: 4, T: 300, n: 1 }, "n", 1.5, "V"),
      challenge("avogadro", "03 / Seal the intake", "The chamber must hold 2.0 L. Set its volume and calculate how many moles are inside.", { P: 100, V: 4, T: 300, n: 1 }, "V", 2, "n", { environment: "INTAKE ARRAY SEAL" })
    ]
  },
  {
    title: "Variable Matrix", code: "05", environment: "MULTI-VARIABLE TEST CELL",
    heading: "Rebalance the variable matrix.", short: "Combined Gas Law",
    intro: "This chamber can change pressure, volume, and temperature. The gas amount stays fixed. Track which variables change before solving the environmental lock.",
    completion: "The Combined Gas Law links pressure, volume, and kelvin temperature for a fixed amount of gas. Identify what changes and what stays constant before solving.",
    challenges: [
      challenge("combined", "01 / Three-variable adjustment", "Heat the sample to 450 K while holding its 3.0 L volume. Calculate the resulting pressure.", { P: 100, V: 3, T: 300, n: 1 }, "T", 450, "P"),
      challenge("combined", "02 / Pressure equalization", "At 300 K, extend the chamber to 3.0 L. Calculate the pressure after equalization.", { P: 120, V: 2, T: 300, n: 1 }, "V", 3, "P"),
      challenge("combined", "03 / Environmental matrix lock", "The lock requires 150 kPa at 450 K. Adjust both pressure and temperature, then calculate the chamber volume.", { P: 100, V: 4, T: 300, n: 1 }, "P", 150, "V", { environment: "VARIABLE MATRIX LOCK", secondaryControl: "T", secondaryTarget: 450 })
    ]
  },
  {
    title: "Ideal Chamber", code: "06", environment: "ADVANCED IDEAL-GAS LAB",
    heading: "Complete the ideal chamber trial.", short: "Ideal Gas Law",
    intro: "The advanced cell models all four gas variables. Use kelvin, kPa, liters, and moles with R = 8.314 kPa·L/(mol·K).",
    completion: "The Ideal Gas Law combines all four state variables. It is an idealized model; real gases can deviate, especially at high pressure or low temperature.",
    challenges: [
      challenge("ideal", "01 / Chamber equation", "One mole of gas at 300 K occupies 20.0 L. Calculate its pressure using PV = nRT.", { P: 103.925, V: 24, T: 300, n: 1 }, "V", 20, "P", { max: 30 }),
      challenge("ideal", "02 / Thermal response", "Raise one mole of gas to 450 K in a 24.0 L chamber. Calculate the pressure.", { P: 103.925, V: 24, T: 300, n: 1 }, "T", 450, "P"),
      challenge("ideal", "03 / Final cell calibration", "Add gas until the sample contains 2.0 mol in a 24.0 L chamber at 300 K. Calculate pressure.", { P: 103.925, V: 24, T: 300, n: 1 }, "n", 2, "P", { environment: "ADVANCED CELL CALIBRATION" })
    ]
  },
  {
    title: "Final Examination", code: "07", environment: "EXAMINATION CHAMBER",
    heading: "Identify the law. Clear the facility.", short: "Comprehensive Exam",
    intro: "The final chamber will not name the relationship for you. Identify the correct gas law, set the requested variable, and calculate the live reading. Temperatures are always in kelvin.",
    completion: "You identified and applied the correct gas-law relationships. These equations describe idealized behavior; real gases may deviate at high pressures or low temperatures.",
    challenges: [
      challenge("boyle", "01 / Lockdown valve", "A sealed sample is compressed from 4.0 L to 2.0 L at constant temperature. Predict the resulting pressure.", { P: 100, V: 4, T: 300, n: 1 }, "V", 2, "P", { hideLaw: true, environment: "LOCKDOWN VALVE" }),
      challenge("charles", "02 / Thermal archive", "A gas at constant pressure warms from 300 K to 450 K. It begins at 4.0 L. Find its new volume.", { P: 100, V: 4, T: 300, n: 1 }, "T", 450, "V", { hideLaw: true, environment: "THERMAL ARCHIVE" }),
      challenge("ideal", "03 / Final authorization", "One mole at 300 K occupies a 20.0 L cell. Use the appropriate relationship to find its pressure.", { P: 124.71, V: 20, T: 300, n: 1 }, "V", 20, "P", { hideLaw: true, environment: "FINAL AUTHORIZATION", max: 30 })
    ]
  }
];

const GameState = {
  stageId: 0,
  challengeIndex: 0,
  currentValues: null,
  challengeSolved: false,
  stageComplete: false,
  attempts: 0,
  hintsUsed: 0,
  startedAt: null,
  reducedMotion: false,
  progress: { unlocked: 0, completed: [], currentStage: 0, logs: [] }
};

// GasLawEngine keeps all scientific calculations in one place.
const GasLawEngine = {
  gasConstant: 8.314,
  calculate(initial, law, control, controlValue, observed, secondaryControl, secondaryValue) {
    const values = { ...initial, [control]: controlValue };
    if (secondaryControl) values[secondaryControl] = secondaryValue;
    const valid = Object.keys(UNITS).every(key => Number.isFinite(values[key]) && values[key] > 0);
    if (!valid) throw new RangeError("Pressure, volume, temperature, and amount of gas must remain positive.");
    if (law === "boyle") {
      const constant = initial.P * initial.V;
      if (observed === "P") values.P = constant / values.V;
      if (observed === "V") values.V = constant / values.P;
    } else if (law === "charles") {
      const ratio = initial.V / initial.T;
      if (observed === "V") values.V = ratio * values.T;
      if (observed === "T") values.T = values.V / ratio;
    } else if (law === "gayLussac") {
      const ratio = initial.P / initial.T;
      if (observed === "P") values.P = ratio * values.T;
      if (observed === "T") values.T = values.P / ratio;
    } else if (law === "avogadro") {
      const ratio = initial.V / initial.n;
      if (observed === "V") values.V = ratio * values.n;
      if (observed === "n") values.n = values.V / ratio;
    } else if (law === "combined") {
      const constant = initial.P * initial.V / initial.T;
      if (observed === "P") values.P = constant * values.T / values.V;
      if (observed === "V") values.V = constant * values.T / values.P;
      if (observed === "T") values.T = values.P * values.V / constant;
    } else if (law === "ideal") {
      if (observed === "P") values.P = values.n * this.gasConstant * values.T / values.V;
      if (observed === "V") values.V = values.n * this.gasConstant * values.T / values.P;
      if (observed === "n") values.n = values.P * values.V / (this.gasConstant * values.T);
      if (observed === "T") values.T = values.P * values.V / (values.n * this.gasConstant);
    }
    if (!Number.isFinite(values[observed]) || values[observed] <= 0) throw new RangeError("The calculated result must be positive.");
    return values;
  },
  answerTolerance(value) {
    return Math.max(0.05, Math.abs(value) * 0.01);
  },
  controlTolerance(challengeData) {
    return Math.max(challengeData.step * 0.55, Math.abs(challengeData.controlTarget) * 0.005);
  },
  format(value) {
    const adjusted = value + Math.sign(value) * Number.EPSILON * Math.abs(value);
    return (Math.round(adjusted * 100) / 100).toString();
  }
};

const ProgressionManager = {
  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const data = JSON.parse(saved);
      if (data && Number.isInteger(data.unlocked) && Array.isArray(data.completed) && Array.isArray(data.logs)) {
        GameState.progress = {
          unlocked: Math.max(0, Math.min(STAGES.length - 1, data.unlocked)),
          completed: data.completed.filter(id => Number.isInteger(id) && id >= 0 && id < STAGES.length),
          currentStage: Number.isInteger(data.currentStage) ? Math.max(0, Math.min(STAGES.length - 1, data.currentStage)) : 0,
          logs: data.logs.slice(-250)
        };
      }
    } catch (error) {
      console.error("Could not read saved GASBOUND progress.", error);
    }
  },
  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(GameState.progress));
    } catch (error) {
      console.error("Could not save GASBOUND progress.", error);
      if (UIController.elements.feedback) UIController.setFeedback("Progress could not be saved in this browser.", "error");
    }
  },
  isUnlocked(stageId) {
    return stageId <= GameState.progress.unlocked;
  },
  isCompleted(stageId) {
    return GameState.progress.completed.includes(stageId);
  },
  completeStage(stageId) {
    if (!this.isCompleted(stageId)) GameState.progress.completed.push(stageId);
    GameState.progress.unlocked = Math.max(GameState.progress.unlocked, Math.min(STAGES.length - 1, stageId + 1));
    GameState.progress.currentStage = Math.min(STAGES.length - 1, stageId + 1);
    this.save();
  },
  reset() {
    GameState.progress = { unlocked: 0, completed: [], currentStage: 0, logs: [] };
    this.save();
  }
};

// UIController owns screen visibility, display updates, and reusable dialogs.
const UIController = {
  elements: {},
  init() {
    document.querySelectorAll("[id]").forEach(element => { this.elements[element.id] = element; });
    this.createParticles();
    this.bindNavigation();
    this.bindExperimentControls();
    this.bindDialogs();
    this.renderHub();
    this.showScreen("menuScreen");
    if (GameState.reducedMotion) document.body.classList.add("reduced-motion");
  },
  createParticles() {
    const container = this.elements.particles;
    for (let i = 0; i < 22; i += 1) {
      const particle = document.createElement("i");
      particle.className = "particle";
      particle.style.left = `${8 + ((i * 37) % 83)}%`;
      particle.style.top = `${8 + ((i * 53) % 83)}%`;
      particle.style.setProperty("--duration", `${1.2 + ((i * 17) % 19) / 10}s`);
      particle.style.setProperty("--delay", `${-((i * 13) % 20) / 10}s`);
      container.appendChild(particle);
    }
  },
  bindNavigation() {
    this.elements.startButton.addEventListener("click", () => NavigationManager.openHub());
    this.elements.continueButton.addEventListener("click", () => NavigationManager.continueCampaign());
    this.elements.archiveButton.addEventListener("click", () => NavigationManager.openStageSelection());
    this.elements.rosterButton.addEventListener("click", () => this.openInfo("ASSISTANT ROSTER"));
    this.elements.settingsButton.addEventListener("click", () => this.openInfo("SETTINGS"));
    this.elements.hubMenuButton.addEventListener("click", () => NavigationManager.returnToMenu());
    this.elements.hubLogo.addEventListener("click", event => { event.preventDefault(); NavigationManager.returnToMenu(); });
    this.elements.stageSelectLogo.addEventListener("click", event => { event.preventDefault(); NavigationManager.openHub(); });
    this.elements.stageSelectBack.addEventListener("click", () => NavigationManager.openHub());
    this.elements.stageSelectButton.addEventListener("click", () => NavigationManager.openStageSelection());
    this.elements.viewStagesButton.addEventListener("click", () => NavigationManager.openStageSelection());
    this.elements.hubArchiveButton.addEventListener("click", () => NavigationManager.openStageSelection());
    this.elements.hubLogButton.addEventListener("click", () => this.openInfo("OBSERVATION LOG"));
    this.elements.hubRosterButton.addEventListener("click", () => this.openInfo("ASSISTANT ROSTER"));
    this.elements.hubSettingsButton.addEventListener("click", () => this.openInfo("SETTINGS"));
    this.elements.stageCardGrid.addEventListener("click", event => {
      const button = event.target.closest("[data-stage]");
      if (button && !button.disabled) NavigationManager.launchStage(Number(button.dataset.stage));
    });
    this.elements.labLogo.addEventListener("click", event => {
      event.preventDefault();
      NavigationManager.openPause();
    });
    this.elements.pauseButton.addEventListener("click", () => NavigationManager.openPause());
    this.elements.resumeButton.addEventListener("click", () => this.elements.pauseOverlay.classList.add("hidden"));
    this.elements.restartStageButton.addEventListener("click", () => NavigationManager.restartFromPause());
    this.elements.pauseHubButton.addEventListener("click", () => NavigationManager.hubFromPause());
    this.elements.returnHubButton.addEventListener("click", () => NavigationManager.openHub());
    this.elements.replayButton.addEventListener("click", () => NavigationManager.replayStage());
    this.elements.nextStageButton.addEventListener("click", () => NavigationManager.nextStage());
    this.elements.viewLogButton.addEventListener("click", () => this.openInfo("OBSERVATION LOG"));
  },
  bindExperimentControls() {
    this.elements.volumeSlider.addEventListener("input", event => InteractionManager.setControl(Number(event.target.value)));
    this.elements.secondarySlider.addEventListener("input", event => InteractionManager.setSecondaryControl(Number(event.target.value)));
    this.elements.decreaseButton.addEventListener("click", () => InteractionManager.nudgeControl(-1));
    this.elements.increaseButton.addEventListener("click", () => InteractionManager.nudgeControl(1));
    this.elements.submitButton.addEventListener("click", () => PuzzleManager.submit());
    this.elements.answerInput.addEventListener("keydown", event => {
      if (event.key === "Enter") PuzzleManager.submit();
    });
    this.elements.hintButton.addEventListener("click", () => AssistantSystem.requestHint());
    this.elements.helpButton.addEventListener("click", () => this.openInfo("FIELD CONTROLS"));
    document.addEventListener("keydown", event => InteractionManager.handleKey(event));
  },
  bindDialogs() {
    this.elements.closeModal.addEventListener("click", () => this.closeModal());
    this.elements.infoModal.addEventListener("click", event => {
      if (event.target === this.elements.infoModal) this.closeModal();
    });
    this.elements.modalContent.addEventListener("click", event => {
      if (event.target.id === "resetProgressButton") NavigationManager.resetProgress();
      if (event.target.id === "toggleMotionButton") NavigationManager.toggleMotion();
    });
    this.elements.infoModal.addEventListener("change", event => {
      if (event.target.id === "motionSetting") NavigationManager.toggleMotion();
    });
  },
  showScreen(id) {
    document.querySelectorAll(".screen").forEach(screen => screen.classList.add("hidden"));
    this.elements[id].classList.remove("hidden");
    this.elements.infoModal.classList.add("hidden");
    this.elements.pauseOverlay.classList.add("hidden");
  },
  renderHub() {
    const done = GameState.progress.completed.length;
    this.elements.progressSummary.textContent = `${done} / ${STAGES.length} OPERATIONS CLEARED`;
    this.elements.progressBar.style.width = `${(done / STAGES.length) * 100}%`;
    this.elements.hubRank.textContent = done === 0 ? "ROOKIE RESEARCHER" : done < 3 ? "JUNIOR ANALYST" : done < 7 ? "SENIOR RESEARCHER" : "GASBOUND SPECIALIST";
    this.elements.currentOperation.textContent = STAGES[GameState.progress.currentStage].title.toUpperCase();
    const completedNames = GameState.progress.completed.map(id => STAGES[id].title);
    this.elements.lastCleared.textContent = completedNames.length ? completedNames[completedNames.length - 1].toUpperCase() : "NO OPERATIONS CLEARED";
    this.elements.completedStages.textContent = completedNames.length ? `${completedNames.length} operation${completedNames.length === 1 ? "" : "s"} completed` : "Your research record is ready.";
    this.elements.stageMiniList.innerHTML = "";
    STAGES.forEach((stage, id) => {
      const item = document.createElement("div");
      item.className = `stage-mini ${ProgressionManager.isCompleted(id) ? "is-completed" : ""} ${ProgressionManager.isUnlocked(id) && !ProgressionManager.isCompleted(id) ? "is-available" : ""}`;
      item.innerHTML = `<span>${stage.code}</span><b>${stage.title}</b><i>${ProgressionManager.isCompleted(id) ? "CLEAR" : ProgressionManager.isUnlocked(id) ? "READY" : "LOCKED"}</i>`;
      this.elements.stageMiniList.appendChild(item);
    });
    this.renderStageCards();
  },
  renderStageCards() {
    this.elements.stageCardGrid.innerHTML = "";
    STAGES.forEach((stage, id) => {
      const unlocked = ProgressionManager.isUnlocked(id);
      const completed = ProgressionManager.isCompleted(id);
      const card = document.createElement("button");
      card.type = "button";
      card.dataset.stage = String(id);
      card.disabled = !unlocked;
      card.className = `stage-card ${unlocked ? "is-available" : "is-locked"} ${completed ? "is-completed" : ""} ${id === GameState.progress.currentStage ? "is-current" : ""}`;
      const status = completed ? "COMPLETED" : unlocked ? (id === GameState.progress.currentStage ? "CURRENT / READY" : "AVAILABLE") : "CLEAR PREVIOUS STAGE";
      card.innerHTML = `<span class="stage-card-top"><b>STAGE ${stage.code}</b><i>${completed ? "✓" : unlocked ? "●" : "🔒"}</i></span><strong>${stage.title}</strong><small>${stage.short}</small><span class="stage-card-bottom">${status}<b>${unlocked ? "↗" : "LOCKED"}</b></span>`;
      this.elements.stageCardGrid.appendChild(card);
    });
  },
  renderChallenge() {
    const stage = STAGES[GameState.stageId];
    const data = stage.challenges[GameState.challengeIndex];
    const law = LAWS[data.law];
    const hiddenLaw = data.hideLaw === true;
    this.elements.labScreen.className = `screen lab-screen stage-theme-${GameState.stageId}`;
    this.elements.missionHeading.textContent = stage.title.toUpperCase();
    this.elements.missionEyebrow.textContent = `ACTIVE OPERATION / ${stage.code}`;
    this.elements.labOperationCode.textContent = `SIMULATION // ${stage.code}`;
    this.elements.stageBadge.textContent = `${stage.code}—${String(GameState.challengeIndex + 1).padStart(2, "0")}`;
    this.elements.stageTitle.textContent = data.title;
    this.elements.stageIntro.textContent = `${stage.intro} ${data.prompt}`;
    this.elements.challengeCounter.innerHTML = `${String(GameState.challengeIndex + 1).padStart(2, "0")} <small>/ ${String(stage.challenges.length).padStart(2, "0")}</small>`;
    this.elements.lawName.textContent = hiddenLaw ? "IDENTIFY THE RELATIONSHIP" : law.name;
    this.elements.lawEquation.textContent = hiddenLaw ? "?" : law.equation;
    this.elements.lawDescription.textContent = hiddenLaw ? "Review what changes, what stays constant, and select the relationship before submitting." : law.description;
    this.elements.constantList.innerHTML = this.constantMarkup(data);
    this.elements.sceneEnvironment.textContent = data.environment || stage.environment;
    this.elements.chamberTitle.textContent = stage.short.toUpperCase();
    this.elements.chamberBaseLabel.textContent = data.control === "T" ? "THERMAL REGULATOR" : data.control === "n" ? "GAS INTAKE CONTROL" : data.control === "P" ? "PRESSURE REGULATOR" : "PISTON DISPLACEMENT";
    this.elements.controlLabel.textContent = `${VARIABLE_NAMES[data.control]} CONTROL`;
    this.elements.controlUnit.textContent = UNITS[data.control];
    this.elements.sliderHint.textContent = `ADJUST ${VARIABLE_NAMES[data.control]} USING THE SLIDER OR +/-`;
    this.elements.sliderMin.textContent = GasLawEngine.format(data.min);
    this.elements.sliderMax.textContent = GasLawEngine.format(data.max);
    this.elements.volumeSlider.min = String(data.min);
    this.elements.volumeSlider.max = String(data.max);
    this.elements.volumeSlider.step = String(data.step);
    this.elements.volumeSlider.setAttribute("aria-label", `Adjust ${VARIABLE_NAMES[data.control].toLowerCase()}`);
    this.elements.decreaseButton.setAttribute("aria-label", `Decrease ${VARIABLE_NAMES[data.control].toLowerCase()}`);
    this.elements.increaseButton.setAttribute("aria-label", `Increase ${VARIABLE_NAMES[data.control].toLowerCase()}`);
    const hasSecondary = Boolean(data.secondaryControl);
    this.elements.secondaryControlGroup.classList.toggle("hidden", !hasSecondary);
    if (hasSecondary) {
      const ranges = { P: [20, 400, 5], V: [0.5, 12, 0.1], T: [150, 700, 5], n: [0.1, 5, 0.1] };
      const [min, max, step] = ranges[data.secondaryControl];
      this.elements.secondaryControlLabel.textContent = `${VARIABLE_NAMES[data.secondaryControl]} CONTROL`;
      this.elements.secondaryUnit.textContent = UNITS[data.secondaryControl];
      this.elements.secondaryMin.textContent = GasLawEngine.format(min);
      this.elements.secondaryMax.textContent = GasLawEngine.format(max);
      this.elements.secondarySlider.min = String(min);
      this.elements.secondarySlider.max = String(max);
      this.elements.secondarySlider.step = String(step);
      this.elements.secondarySlider.setAttribute("aria-label", `Adjust ${VARIABLE_NAMES[data.secondaryControl].toLowerCase()}`);
    }
    this.elements.answerLabel.textContent = `CALCULATED ${VARIABLE_NAMES[data.observed]}`;
    this.elements.answerUnit.textContent = UNITS[data.observed];
    this.elements.answerInput.setAttribute("aria-label", `Calculated ${VARIABLE_NAMES[data.observed]}`);
    this.elements.answerInput.step = "0.1";
    this.elements.lawSelect.classList.toggle("hidden", !hiddenLaw);
    this.elements.lawSelectLabel.classList.toggle("hidden", !hiddenLaw);
    this.elements.lawSelect.value = "";
    this.elements.targetCardLabel.textContent = `TARGET ${VARIABLE_NAMES[data.observed]}`;
    this.elements.targetValue.textContent = GasLawEngine.format(this.getExpected(data));
    this.elements.targetUnit.textContent = UNITS[data.observed];
    this.elements.pressureCardLabel.textContent = "PRESSURE";
    this.elements.pressureCardUnit.textContent = UNITS.P;
    this.elements.volumeFoot.textContent = data.control === "V" || data.observed === "V" ? "VARIABLE / V" : "CHAMBER / V";
    this.elements.temperatureFoot.textContent = data.control === "T" || data.observed === "T" ? "VARIABLE / K" : "KELVIN / K";
    this.elements.footerStageName.textContent = stage.short.toUpperCase();
    this.elements.exitDoor.classList.remove("open");
    this.elements.exitLabel.textContent = "LOCKED";
    this.elements.doorLock.textContent = "■";
    this.elements.submitButton.innerHTML = `SUBMIT MEASUREMENT <b>→</b>`;
    this.elements.answerInput.value = "";
    this.elements.hintCounter.textContent = "HINT 01 / 03";
    this.setFeedback("Adjust the experimental control, calculate the live reading, and submit your answer.");
    this.setAssistantMessage(`ANALYST online. ${hiddenLaw ? "Identify the relationship from the variables and conditions." : law.description}`);
    this.renderMeasurements();
  },
  getExpected(data) {
    return GasLawEngine.calculate(data.initial, data.law, data.control, data.controlTarget, data.observed, data.secondaryControl, data.secondaryTarget)[data.observed];
  },
  constantMarkup(data) {
    const laws = {
      boyle: ["T", "n"], charles: ["P", "n"], gayLussac: ["V", "n"],
      avogadro: ["P", "T"], combined: ["n"], ideal: []
    };
    const constants = laws[data.law] || [];
    if (data.law === "orientation") return '<div class="condition-row"><span class="condition-icon">T</span><div><strong>Temperature</strong><small>Displayed in kelvin</small></div><b>UNITS</b></div><div class="condition-row"><span class="condition-icon">n</span><div><strong>Gas amount</strong><small>Displayed in moles</small></div><b>UNITS</b></div>';
    return constants.length ? constants.map(key => `<div class="condition-row"><span class="condition-icon">${key}</span><div><strong>${VARIABLE_NAMES[key]}</strong><small>Held at ${GasLawEngine.format(data.initial[key])} ${UNITS[key]}</small></div><b>LOCKED</b></div>`).join("") : '<div class="condition-row"><span class="condition-icon">R</span><div><strong>Ideal gas constant</strong><small>8.314 kPa·L/(mol·K)</small></div><b>FIXED</b></div>';
  },
  renderMeasurements() {
    if (!GameState.currentValues) return;
    const data = STAGES[GameState.stageId].challenges[GameState.challengeIndex];
    const values = GameState.currentValues;
    const controlValue = values[data.control];
    const pressure = values.P;
    const display = key => GasLawEngine.format(values[key]);
    this.elements.volumeSlider.value = String(controlValue);
    this.elements.sliderVolume.textContent = display(data.control);
    const percentage = ((controlValue - data.min) / (data.max - data.min)) * 100;
    this.elements.volumeSlider.style.background = `linear-gradient(90deg, var(--cyan) 0%, var(--cyan) ${percentage}%, #28414c ${percentage}%, #28414c 100%)`;
    if (data.secondaryControl) {
      const ranges = { P: [20, 400], V: [0.5, 12], T: [150, 700], n: [0.1, 5] };
      const [secondaryMin, secondaryMax] = ranges[data.secondaryControl];
      const secondaryValue = values[data.secondaryControl];
      const secondaryPercentage = ((secondaryValue - secondaryMin) / (secondaryMax - secondaryMin)) * 100;
      this.elements.secondarySlider.value = String(secondaryValue);
      this.elements.secondaryValue.textContent = GasLawEngine.format(secondaryValue);
      this.elements.secondarySlider.style.background = `linear-gradient(90deg, var(--cyan) 0%, var(--cyan) ${secondaryPercentage}%, #28414c ${secondaryPercentage}%, #28414c 100%)`;
    }
    this.elements.volumeValue.textContent = display("V");
    this.elements.chamberVolume.textContent = `${display("V")} L`;
    this.elements.pressureReadout.textContent = display("P");
    this.elements.pressureValue.textContent = display("P");
    this.elements.temperatureValue.textContent = display("T");
    this.elements.temperatureReadout.innerHTML = `${display("T")} K <i>●</i>`;
    this.elements.pressureDelta.textContent = `${VARIABLE_NAMES[data.observed]} / ${UNITS[data.observed]}`;
    this.elements.pressureBar.style.width = `${Math.min(100, Math.max(0, pressure / 3))}%`;
    this.elements.gaugeVariableLabel.textContent = "CHAMBER PRESSURE";
    this.elements.gaugeUnit.textContent = "kPa";
    this.elements.pressureUnit.textContent = "kPa";
    const angle = -120 + Math.min(1, pressure / 300) * 240;
    this.elements.gaugeNeedle.style.transform = `rotate(${angle}deg)`;
    this.elements.gaugeStatus.classList.toggle("warning", pressure >= 180);
    this.elements.gaugeStatus.innerHTML = pressure >= 180 ? "<i></i> PRESSURE ELEVATED" : "<i></i> NOMINAL";
    const pistonHeight = 16 + Math.max(0, Math.min(1, (12 - values.V) / 11.5)) * 68;
    this.elements.piston.style.height = `${pistonHeight}%`;
    this.elements.particles.style.transform = `scale(${1 + (4 - values.V) * 0.045})`;
    this.elements.particles.style.transformOrigin = "center bottom";
  },
  setAssistantMessage(message) { this.elements.assistantMessage.textContent = message; },
  setFeedback(message, type) {
    this.elements.feedback.textContent = message;
    this.elements.feedback.className = `feedback${type ? ` ${type}` : ""}`;
  },
  addLogEntry(title, detail) {
    const row = document.createElement("div");
    row.className = "log-entry";
    const index = document.createElement("span");
    index.className = "log-index";
    index.textContent = String(this.elements.logBody.querySelectorAll(".log-entry").length + 1).padStart(2, "0");
    const text = document.createElement("div");
    const heading = document.createElement("strong");
    heading.textContent = title;
    const sub = document.createElement("small");
    sub.textContent = detail;
    text.append(heading, sub);
    const timestamp = document.createElement("time");
    timestamp.textContent = this.elapsedTime();
    row.append(index, text, timestamp);
    const constants = this.elements.logBody.querySelector(".log-constants");
    this.elements.logBody.insertBefore(row, constants);
    this.elements.logCount.textContent = `${String(this.elements.logBody.querySelectorAll(".log-entry").length).padStart(2, "0")} ENTRIES`;
  },
  elapsedTime() {
    if (!GameState.startedAt) return "00:00";
    const seconds = Math.floor((Date.now() - GameState.startedAt) / 1000);
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  },
  setAssistantHintCount() {
    const next = Math.min(GameState.hintsUsed + 1, 3);
    this.elements.hintCounter.textContent = GameState.hintsUsed >= 3 ? "HINTS USED" : `HINT ${String(next).padStart(2, "0")} / 03`;
  },
  initializeLog() {
    const data = STAGES[GameState.stageId].challenges[GameState.challengeIndex];
    this.elements.logBody.innerHTML = `<div class="log-constants"><span>CONSTANTS</span><b>${this.constantNames(data)}</b></div>`;
    this.elements.logCount.textContent = "00 ENTRIES";
    this.addLogEntry("INITIAL MEASUREMENTS", this.measurementSummary(data.initial));
  },
  measurementSummary(values) {
    return `P ${GasLawEngine.format(values.P)} kPa · V ${GasLawEngine.format(values.V)} L · T ${GasLawEngine.format(values.T)} K · n ${GasLawEngine.format(values.n)} mol`;
  },
  constantNames(data) {
    const names = { boyle: "T, n FIXED", charles: "P, n FIXED", gayLussac: "V, n FIXED", avogadro: "P, T FIXED", combined: "n FIXED", ideal: "R FIXED" };
    return names[data.law] || "MEASURE ALL VARIABLES";
  },
  openInfo(kind) {
    this.elements.modalTitle.textContent = kind;
    if (kind === "ASSISTANT ROSTER") {
      this.elements.modalContent.innerHTML = '<div class="modal-content-row"><span>ANALYST</span><b>SCIENCE SUPPORT · ONLINE</b></div><p class="modal-note">ANALYST gives optional progressive hints: first a concept, then the relationship between variables, then the equation. Hints do not reveal the numerical answer.</p><div class="modal-content-row"><span>FUTURE OPERATORS</span><b>FACILITY STAFF IN TRAINING</b></div>';
    } else if (kind === "SETTINGS") {
      this.elements.modalContent.innerHTML = `<div class="modal-content-row"><span>DISPLAY MOTION</span><b>${GameState.reducedMotion ? "REDUCED" : "STANDARD"}</b></div><button class="button button-quiet modal-action" id="toggleMotionButton">TOGGLE MOTION <b>↻</b></button><div class="modal-content-row"><span>LOCAL PLAYER DATA</span><b>${GameState.progress.completed.length} CLEARED</b></div><button class="button button-quiet modal-action danger-action" id="resetProgressButton">RESET PROGRESS <b>!</b></button><p class="modal-note">Resetting progress requires confirmation and removes this device's saved stage clears and experiment log.</p>`;
    } else if (kind === "OBSERVATION LOG") {
      const logs = GameState.progress.logs.slice().reverse();
      if (!logs.length) {
        this.elements.modalContent.innerHTML = '<p class="modal-note">No submitted experiment records yet. Complete a challenge to add measurements to your research log.</p>';
      } else {
        this.elements.modalContent.innerHTML = "";
        logs.forEach(entry => {
          const row = document.createElement("div");
          row.className = "archive-log-row";
          const title = document.createElement("strong");
          title.textContent = `${STAGES[entry.stageId] ? STAGES[entry.stageId].title : "Experiment"} · ${entry.challengeTitle}`;
          const readings = document.createElement("small");
          readings.textContent = `INITIAL ${entry.initial} → FINAL ${entry.final} · ${entry.equation} · ANSWER ${entry.answer} · ${entry.success ? "COMPLETE" : "NOT CLEARED"}`;
          const constants = document.createElement("small");
          constants.textContent = `CHANGED: ${entry.changed} · CONSTANT: ${entry.constants} · ${entry.timestamp}`;
          row.append(title, readings, constants);
          this.elements.modalContent.appendChild(row);
        });
      }
    } else if (kind === "STAGE ARCHIVE") {
      this.elements.modalContent.innerHTML = `<p class="modal-note">Progress: ${GameState.progress.completed.length} of ${STAGES.length} operations complete. The archive retains completed experiment attempts on this device.</p>`;
    } else {
      this.elements.modalContent.innerHTML = '<div class="modal-content-row"><span>ADJUST VARIABLE</span><b>DRAG SLIDER OR USE ← / →</b></div><div class="modal-content-row"><span>FINE CONTROL</span><b>− / + BUTTONS OR SHIFT + ARROWS</b></div><div class="modal-content-row"><span>SUBMIT</span><b>ENTER YOUR CALCULATED MEASUREMENT</b></div><p class="modal-note">All temperature readings and calculations use kelvin. The gas laws are idealized models; real gases can deviate at high pressure or low temperature.</p>';
    }
    this.elements.infoModal.classList.remove("hidden");
    this.elements.closeModal.focus();
  },
  closeModal() { this.elements.infoModal.classList.add("hidden"); },
  updateResults() {
    const stage = STAGES[GameState.stageId];
    const completed = GameState.progress.completed.length;
    const data = stage.challenges[stage.challenges.length - 1];
    const finalValues = GameState.currentValues || data.initial;
    const campaignComplete = GameState.stageId === STAGES.length - 1;
    this.elements.resultEyebrow.textContent = campaignComplete ? "FINAL ASSESSMENT // PASSED" : `OPERATION ${stage.code} // CLEAR`;
    this.elements.completionTitle.innerHTML = `${campaignComplete ? "GASBOUND" : stage.title.toUpperCase()}<br><span>${campaignComplete ? "CERTIFIED" : "COMPLETE"}</span>`;
    this.elements.completionCopy.textContent = campaignComplete ?
      "Final examination passed. All eight operations are cleared; your research record is complete." :
      `All ${stage.challenges.length} challenges cleared. Your observation record has been saved.`;
    this.elements.resultChallenges.textContent = `${String(stage.challenges.length).padStart(2, "0")} / ${String(stage.challenges.length).padStart(2, "0")}`;
    this.elements.resultStage.textContent = `${completed} / ${STAGES.length} CLEARED`;
    this.elements.resultMeasurement.textContent = `${GasLawEngine.format(finalValues[data.observed])} ${UNITS[data.observed]}`;
    this.elements.rating.textContent = GameState.attempts <= stage.challenges.length && GameState.hintsUsed === 0 ? "S / CLEAN RUN" : GameState.hintsUsed <= 2 ? "A / ANALYST" : "B / FIELD READY";
    this.elements.principleTitle.textContent = `FIELD NOTE / ${stage.short.toUpperCase()}`;
    this.elements.principleExplanation.textContent = `${stage.completion} Gas laws describe idealized relationships; real gases may deviate under some conditions.`;
    this.elements.nextStageButton.classList.toggle("hidden", GameState.stageId >= STAGES.length - 1);
    this.elements.completionOverlay.classList.remove("hidden");
    this.elements.returnHubButton.focus();
  }
};

// ObservationLog persists complete and incomplete submissions for Hub review.
const ObservationLog = {
  beginStage() { UIController.initializeLog(); },
  recordSubmission(answer, success) {
    const stage = STAGES[GameState.stageId];
    const data = stage.challenges[GameState.challengeIndex];
    const initial = data.initial;
    const finalValues = GameState.currentValues;
    const entry = {
      stageId: GameState.stageId,
      challengeTitle: data.title,
      initial: UIController.measurementSummary(initial),
      final: UIController.measurementSummary(finalValues),
      changed: `${VARIABLE_NAMES[data.control]}${data.secondaryControl ? ` / ${VARIABLE_NAMES[data.secondaryControl]}` : ""} / ${VARIABLE_NAMES[data.observed]}`,
      constants: UIController.constantNames(data),
      equation: LAWS[data.law].equation,
      answer: `${answer} ${UNITS[data.observed]}`,
      success,
      timestamp: new Date().toLocaleString()
    };
    GameState.progress.logs.push(entry);
    GameState.progress.logs = GameState.progress.logs.slice(-250);
    ProgressionManager.save();
    UIController.addLogEntry(success ? "CHALLENGE CLEARED" : "SUBMISSION RECORDED", `ANSWER ${entry.answer} · ${success ? "CONFIRMED" : "REVIEW REQUIRED"}`);
  }
};

// AssistantSystem provides hints that become more specific without giving the result.
const AssistantSystem = {
  requestHint() {
    if (GameState.challengeSolved || GameState.stageComplete) return;
    const data = STAGES[GameState.stageId].challenges[GameState.challengeIndex];
    const law = LAWS[data.law];
    const hints = [
      `Concept: observe how ${VARIABLE_NAMES[data.control].toLowerCase()} and ${VARIABLE_NAMES[data.observed].toLowerCase()} respond in this experiment.`,
      `Relationship: ${law.description} What does the target control setting imply for the live reading?`,
      `Relevant equation: ${law.equation}. Keep the listed constant variables fixed and solve for ${data.observed} in ${UNITS[data.observed]}.`
    ];
    if (GameState.hintsUsed >= hints.length) {
      UIController.setAssistantMessage("That is all three hints. Compare your chamber readings with the objective and check the units.");
      return;
    }
    UIController.setAssistantMessage(hints[GameState.hintsUsed]);
    GameState.hintsUsed += 1;
    UIController.setAssistantHintCount();
  },
  incorrect(controlCorrect, lawCorrect) {
    if (!lawCorrect) UIController.setAssistantMessage("That relationship does not match the variables changing in this chamber. Recheck which quantities are held constant.");
    else if (!controlCorrect) UIController.setAssistantMessage("Your equation may be set up correctly, but the control has not reached the requested setting yet.");
    else UIController.setAssistantMessage("The control is in range. Check the equation rearrangement, kelvin units, and the units requested for your answer.");
  }
};

// PuzzleManager validates both the physical control setting and the calculation.
const PuzzleManager = {
  submit() {
    if (GameState.stageComplete) return;
    if (GameState.challengeSolved) {
      this.nextChallenge();
      return;
    }
    const data = STAGES[GameState.stageId].challenges[GameState.challengeIndex];
    const rawAnswer = UIController.elements.answerInput.value.trim();
    const answer = Number(rawAnswer);
    const expected = UIController.getExpected(data);
    if (!rawAnswer || !Number.isFinite(answer) || answer <= 0) {
      UIController.setFeedback(`Enter a positive ${UNITS[data.observed]} measurement. Temperature answers must be in kelvin.`, "error");
      return;
    }
    let lawCorrect = true;
    if (data.hideLaw) {
      lawCorrect = UIController.elements.lawSelect.value === data.law;
      if (!UIController.elements.lawSelect.value) {
        UIController.setFeedback("Identify the gas law before submitting this exam answer.", "error");
        return;
      }
    }
    GameState.attempts += 1;
    const controlCorrect = Math.abs(GameState.currentValues[data.control] - data.controlTarget) <= GasLawEngine.controlTolerance(data) &&
      (!data.secondaryControl || Math.abs(GameState.currentValues[data.secondaryControl] - data.secondaryTarget) <= Math.max(5 * 0.55, Math.abs(data.secondaryTarget) * 0.005));
    const answerCorrect = Math.abs(answer - expected) <= GasLawEngine.answerTolerance(expected);
    const success = controlCorrect && answerCorrect && lawCorrect;
    ObservationLog.recordSubmission(rawAnswer, success);
    if (!success) {
      const reason = !lawCorrect ? "Identify the relationship that matches the changing variables." :
        !controlCorrect ? `Set ${VARIABLE_NAMES[data.control].toLowerCase()} to the requested target before submitting.` :
          `The chamber is set correctly, but the calculated ${VARIABLE_NAMES[data.observed].toLowerCase()} does not match. Check the units and rearrange the equation.`;
      UIController.setFeedback(reason, "error");
      AssistantSystem.incorrect(controlCorrect, lawCorrect);
      return;
    }
    GameState.challengeSolved = true;
    UIController.setFeedback(`Confirmed: ${GasLawEngine.format(GameState.currentValues[data.observed])} ${UNITS[data.observed]}. ${LAWS[data.law].name} applied.`, "success");
    UIController.setAssistantMessage(`Good work. ${LAWS[data.law].description} ${data.law === "ideal" ? "Remember that real gases can deviate from the ideal model." : ""}`);
    UIController.elements.submitButton.innerHTML = `NEXT CHALLENGE <b>→</b>`;
    UIController.elements.exitDoor.classList.add("open");
    UIController.elements.exitLabel.textContent = "CLEARED";
    UIController.elements.doorLock.textContent = "✓";
    if (GameState.challengeIndex === STAGES[GameState.stageId].challenges.length - 1) {
      this.completeStage();
    }
  },
  nextChallenge() {
    const stage = STAGES[GameState.stageId];
    if (GameState.challengeIndex + 1 >= stage.challenges.length) return;
    GameState.challengeIndex += 1;
    GameState.challengeSolved = false;
    GameState.hintsUsed = 0;
    const data = stage.challenges[GameState.challengeIndex];
    GameState.currentValues = { ...data.initial };
    UIController.renderChallenge();
    ObservationLog.beginStage();
  },
  completeStage() {
    GameState.stageComplete = true;
    ProgressionManager.completeStage(GameState.stageId);
    UIController.updateResults();
  }
};

// InteractionManager handles slider changes, keyboard controls, and safe resets.
const InteractionManager = {
  setControl(value) {
    const data = STAGES[GameState.stageId].challenges[GameState.challengeIndex];
    const bounded = Math.min(data.max, Math.max(data.min, value));
    const snapped = Math.round((bounded - data.min) / data.step) * data.step + data.min;
    try {
      const secondaryValue = data.secondaryControl ? GameState.currentValues[data.secondaryControl] : undefined;
      GameState.currentValues = GasLawEngine.calculate(data.initial, data.law, data.control, snapped, data.observed, data.secondaryControl, secondaryValue);
      UIController.renderMeasurements();
      if (!GameState.challengeSolved) {
        const closeness = Math.abs(GameState.currentValues[data.control] - data.controlTarget);
        UIController.setAssistantMessage(closeness <= GasLawEngine.controlTolerance(data) ?
          "The requested setting is reached. Calculate the live readout and submit your measurement." :
          `${VARIABLE_NAMES[data.control]} is ${GasLawEngine.format(GameState.currentValues[data.control])} ${UNITS[data.control]}. Watch the instrument respond as you adjust it.`);
      }
    } catch (error) {
      UIController.setFeedback(error.message, "error");
    }
  },
  nudgeControl(direction) {
    const input = UIController.elements.volumeSlider;
    this.setControl(Number(input.value) + direction * Number(input.step));
  },
  setSecondaryControl(value) {
    const data = STAGES[GameState.stageId].challenges[GameState.challengeIndex];
    if (!data.secondaryControl) return;
    const ranges = { P: [20, 400, 5], V: [0.5, 12, 0.1], T: [150, 700, 5], n: [0.1, 5, 0.1] };
    const [min, max, step] = ranges[data.secondaryControl];
    const bounded = Math.min(max, Math.max(min, value));
    const snapped = Math.round((bounded - min) / step) * step + min;
    try {
      GameState.currentValues = GasLawEngine.calculate(data.initial, data.law, data.control, GameState.currentValues[data.control], data.observed, data.secondaryControl, snapped);
      UIController.renderMeasurements();
      if (!GameState.challengeSolved) {
        UIController.setAssistantMessage("Both controls affect the chamber. Track the combined pressure-volume-temperature relationship before submitting.");
      }
    } catch (error) {
      UIController.setFeedback(error.message, "error");
    }
  },
  startChallenge() {
    GameState.challengeSolved = false;
    GameState.stageComplete = false;
    GameState.attempts = 0;
    GameState.hintsUsed = 0;
    GameState.startedAt = Date.now();
    const data = STAGES[GameState.stageId].challenges[0];
    GameState.challengeIndex = 0;
    GameState.currentValues = { ...data.initial };
    UIController.elements.completionOverlay.classList.add("hidden");
    UIController.elements.pauseOverlay.classList.add("hidden");
    UIController.showScreen("labScreen");
    UIController.renderChallenge();
    ObservationLog.beginStage();
  },
  restart() {
    this.startChallenge();
  },
  handleKey(event) {
    if (event.key === "Escape") {
      if (!UIController.elements.infoModal.classList.contains("hidden")) UIController.closeModal();
      else if (!UIController.elements.pauseOverlay.classList.contains("hidden")) UIController.elements.pauseOverlay.classList.add("hidden");
      else if (!UIController.elements.completionOverlay.classList.contains("hidden")) return;
      else if (!UIController.elements.labScreen.classList.contains("hidden")) NavigationManager.openPause();
      return;
    }
    if (UIController.elements.labScreen.classList.contains("hidden") ||
        !UIController.elements.pauseOverlay.classList.contains("hidden") ||
        !UIController.elements.completionOverlay.classList.contains("hidden") ||
        !UIController.elements.infoModal.classList.contains("hidden") ||
        event.target === UIController.elements.answerInput ||
        event.target === UIController.elements.lawSelect) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const step = event.shiftKey ? 5 : 1;
      this.nudgeControl(event.key === "ArrowLeft" ? -step : step);
    }
  }
};

// NavigationManager implements the menu → hub → stages → results → hub flow.
const NavigationManager = {
  openHub() {
    UIController.elements.completionOverlay.classList.add("hidden");
    UIController.elements.pauseOverlay.classList.add("hidden");
    UIController.renderHub();
    UIController.showScreen("hubScreen");
  },
  returnToMenu() { UIController.showScreen("menuScreen"); },
  openStageSelection() {
    UIController.renderHub();
    UIController.showScreen("stageSelectScreen");
  },
  continueCampaign() {
    const id = Math.min(GameState.progress.currentStage, GameState.progress.unlocked);
    this.launchStage(id);
  },
  launchStage(stageId) {
    if (!ProgressionManager.isUnlocked(stageId) || !STAGES[stageId]) return;
    GameState.stageId = stageId;
    GameState.progress.currentStage = stageId;
    ProgressionManager.save();
    InteractionManager.startChallenge();
  },
  openPause() {
    if (GameState.stageComplete || UIController.elements.labScreen.classList.contains("hidden")) return;
    UIController.elements.pauseStageName.textContent = `${STAGES[GameState.stageId].title} · CHALLENGE ${GameState.challengeIndex + 1} / ${STAGES[GameState.stageId].challenges.length}`;
    UIController.elements.pauseOverlay.classList.remove("hidden");
    UIController.elements.resumeButton.focus();
  },
  restartFromPause() {
    if (!GameState.stageComplete && !window.confirm("Restart this stage? Your current challenge and attempt will be reset.")) return;
    this.launchStage(GameState.stageId);
  },
  hubFromPause() {
    if (!GameState.stageComplete && !window.confirm("Leave this unfinished experiment and return to the hub? Your saved challenge submissions will remain in the observation log.")) return;
    this.openHub();
  },
  replayStage() { this.launchStage(GameState.stageId); },
  nextStage() {
    const next = GameState.stageId + 1;
    if (next < STAGES.length && ProgressionManager.isUnlocked(next)) this.launchStage(next);
  },
  resetProgress() {
    if (!window.confirm("Reset all GASBOUND stage clears and saved observation records on this device? This cannot be undone.")) return;
    ProgressionManager.reset();
    this.openHub();
    UIController.openInfo("SETTINGS");
  },
  toggleMotion() {
    GameState.reducedMotion = !GameState.reducedMotion;
    document.body.classList.toggle("reduced-motion", GameState.reducedMotion);
    try {
      localStorage.setItem("gasbound_reduced_motion", GameState.reducedMotion ? "true" : "false");
    } catch (error) {
      console.error("Could not save motion preference.", error);
    }
    UIController.openInfo("SETTINGS");
  }
};

ProgressionManager.load();
try {
  GameState.reducedMotion = localStorage.getItem("gasbound_reduced_motion") === "true";
} catch (error) {
  console.error("Could not read motion preference.", error);
}
UIController.init();
window.setInterval(() => {
  if (!UIController.elements.labScreen.classList.contains("hidden")) {
    UIController.elements.facilityTime.textContent = UIController.elapsedTime();
  }
}, 1000);
