import { supabase } from "@/lib/supabaseClient";
import { Mockup } from "@/types/db";

// Solves H such that H * [x, y, 1]^T = [u, v, w]^T → (u/w, v/w) = destination
export function computeHomography(
  srcPts: [number, number][], // e.g., [[0,0], [1,0], [1,1], [0,1]]
  dstPts: [number, number][] // e.g., [[x0,y0], [x1,y1], [x2,y2], [x3,y3]] in pixels
): Float32Array {
  if (srcPts.length !== 4 || dstPts.length !== 4) {
    throw new Error("Need exactly 4 point pairs");
  }

  // Build linear system Ah = 0
  const A = new Array(8).fill(0).map(() => new Array(9).fill(0)) as number[][];
  for (let i = 0; i < 4; i++) {
    const [x, y] = srcPts[i];
    const [u, v] = dstPts[i];
    A[2 * i] = [-x, -y, -1, 0, 0, 0, u * x, u * y, u];
    A[2 * i + 1] = [0, 0, 0, -x, -y, -1, v * x, v * y, v];
  }

  // Solve using SVD or Gaussian elimination (simplified: use pseudo-inverse via numeric.js or manual)
  // For simplicity and browser compatibility, we'll use a direct 8x8 solver (fix h9 = 1)
  const B = new Array(8).fill(0).map(() => new Array(8).fill(0));
  const b = new Array(8).fill(0);
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      B[i][j] = A[i][j];
    }
    b[i] = -A[i][8];
  }

  // Solve B * h = b
  const h = solveLinearSystem(B, b);
  const h9 = 1;
  const H = new Float32Array([...h, h9]);

  return H;
}

// Naive Gaussian elimination for 8x8 (for demo; consider using a math lib in prod)
function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = A.length;
  // Make augmented matrix
  const M = A.map((row, i) => [...row, b[i]]);

  // Forward elimination
  for (let i = 0; i < n; i++) {
    // Partial pivoting
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) maxRow = k;
    }
    [M[i], M[maxRow]] = [M[maxRow], M[i]];

    // Make all rows below this one 0 in current column
    for (let k = i + 1; k < n; k++) {
      const c = -M[k][i] / M[i][i];
      for (let j = i; j < n + 1; j++) {
        if (i === j) {
          M[k][j] = 0;
        } else {
          M[k][j] += c * M[i][j];
        }
      }
    }
  }

  // Back substitution
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = M[i][n] / M[i][i];
    for (let k = i - 1; k >= 0; k--) {
      M[k][n] -= M[k][i] * x[i];
    }
  }
  return x;
}

export const getMockupById = async (id: string): Promise<Mockup> => {
  const { data, error } = await supabase
    .from("mockups")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching related mockups:", error.message);
    throw new Error(error.message);
  }

  return data ?? null;
};
