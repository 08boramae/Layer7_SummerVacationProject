from typing import Literal, Optional

from backend.models.challenge import Challenge


def compute_challenge_value(challenge: Challenge, solve_count: int) -> int:
    """Return the points to award for the given challenge at the given 1-based solve_count.
    - For static: returns challenge.points
    - For dynamic: computes based on challenge config with clipping to minimum_value.
    """
    if challenge.scoring_type != "dynamic":
        return int(challenge.points)

    initial = int(challenge.initial_value or 0)
    minimum = int(challenge.minimum_value or 0)
    decay = float(challenge.decay_value or 0.0)
    func_type: Optional[str] = challenge.decay_function

    value: float
    if func_type == "linear":
        value = initial - (decay * solve_count)
    elif func_type == "logarithmic":
        # (((Minimum - Initial) / (Decay^2)) * (SolveCount^2)) + Initial
        if decay == 0:
            value = initial
        else:
            value = (((minimum - initial) / (decay ** 2)) * (solve_count ** 2)) + initial
    else:
        value = challenge.points

    if minimum is not None:
        value = max(value, minimum)
    return int(round(value)) 