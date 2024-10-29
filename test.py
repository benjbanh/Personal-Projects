import numpy as np

# Define the coefficients of the equations
A = np.array([[12000, -10000, -2000], [-10000, 18300, -3600], [-2000, -3600, 6600]])
B = np.array([-10,0,0])

# Solve the system of equations
currents = np.linalg.solve(A, B)
print(currents)
