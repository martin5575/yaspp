interface Team {
  attack: number;
  defense: number;
  alpha_H: number;
  alpha_A: number;
}

const teams: { [key: string]: Team } = {
  "TeamA": { attack: 1.5, defense: 1.0, alpha_H: 1.2, alpha_A: 0.8 },
  "TeamB": { attack: 1.2, defense: 1.2, alpha_H: 1.1, alpha_A: 1.0 },
};

// Calculate risk factor
const riskFactor = (t: number, T: number, beta: number = 0.5): number => {
  return 1 + beta * (T - t) / T;
};

// Calibrate transition probabilities for each team
const calibrateTeamTransitionMatrix = (
  team: Team,
  t: number,
  T: number,
  delta_t: number,
  isHome: boolean
): number[] => {
  const { attack, defense, alpha_H, alpha_A } = team;

  // Risk factor
  const R_t = riskFactor(t, T);

  // Transition probabilities for each team
  const P_modified: number[] = [0.0, 0.0, 0.0]; // P(Delta_t = -1, 0, +1)

  // Apply home advantage and risk behavior
  if (isHome) {
    P_modified[2] = attack * alpha_H; // Probability of scoring
  } else {
    P_modified[0] = defense * alpha_A; // Probability of conceding
  }

  // Adjust risk behavior when trailing
  if (delta_t < 0) { // Team is trailing
    P_modified[2] *= R_t; // Risk of scoring increases
    P_modified[0] *= R_t; // Risk of conceding increases
  }

  // Normalize probabilities
  const sum = P_modified.reduce((acc, val) => acc + val, 0);
  if (sum > 0) {
    for (let i = 0; i < P_modified.length; i++) {
      P_modified[i] /= sum;
    }
  }

  return P_modified;
};

// Example: Calibration for TeamA (home team) when trailing
const T = 20; // 20 time slots
const delta_t = -1; // Trailing
const t = 5; // Time in the game
const isHome = true; // Team A is the home team

const P_teamA = calibrateTeamTransitionMatrix(teams["TeamA"], t, T, delta_t, isHome);
console.log(P_teamA);