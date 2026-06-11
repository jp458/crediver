/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';

interface QRCodeSVGProps {
  value: string;
  size?: number;
}

export function QRCodeSVG({ value, size = 160 }: QRCodeSVGProps) {
  // We'll generate a deterministic 21x21 or 25x25 grid based on the string 'value'
  // and render it in pristine SVG.
  const grid = useMemo(() => {
    // Generate a simple pseudo-random grid seeded by value to make it look unique for each business
    const seed = value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const sizeGrid = 25;
    const matrix: boolean[][] = [];

    // Initialize matrix
    for (let r = 0; r < sizeGrid; r++) {
      matrix[r] = [];
      for (let c = 0; c < sizeGrid; c++) {
        // Standard QR code finder patterns at top-left, top-right, bottom-left
        const isFinderTL = r < 7 && c < 7;
        const isFinderTR = r < 7 && c >= sizeGrid - 7;
        const isFinderBL = r >= sizeGrid - 7 && c < 7;
        
        if (isFinderTL) {
          // Check if outer ring, inner space, or core block
          const dist = Math.max(Math.abs(r - 3), Math.abs(c - 3));
          matrix[r][c] = dist === 3 || dist <= 1;
        } else if (isFinderTR) {
          const dist = Math.max(Math.abs(r - 3), Math.abs(c - (sizeGrid - 4)));
          matrix[r][c] = dist === 3 || dist <= 1;
        } else if (isFinderBL) {
          const dist = Math.max(Math.abs(r - (sizeGrid - 4)), Math.abs(c - 3));
          matrix[r][c] = dist === 3 || dist <= 1;
        } else {
          // Center logo area (skip drawing modules in 5x5 center)
          const isCenter = r >= 10 && r < 15 && c >= 10 && c < 15;
          if (isCenter) {
            matrix[r][c] = false;
          } else {
            // Pseudo-random deterministic noise based on coordinate and seed
            const pseudoRandomVal = Math.sin(r * 12.9898 + c * 78.233 + seed) * 43758.5453123;
            matrix[r][c] = (pseudoRandomVal - Math.floor(pseudoRandomVal)) > 0.48;
          }
        }
      }
    }
    return { matrix, sizeGrid };
  }, [value]);

  const { matrix, sizeGrid } = grid;
  const cellSize = size / sizeGrid;

  return (
    <div className="relative flex flex-col items-center justify-center bg-white p-3 rounded-2xl shadow-sm border border-gray-100" style={{ width: size + 24, height: size + 24 }}>
      {/* Dynamic scan line effect */}
      <div className="absolute inset-x-3 h-0.5 bg-green-500 opacity-60 rounded animate-bounce" style={{ top: '10%' }} />

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background */}
        <rect width={size} height={size} fill="white" />

        {/* QR Code Matrix Modules */}
        {matrix.map((row, r) =>
          row.map((cell, c) => {
            if (!cell) return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize - 0.2}
                height={cellSize - 0.2}
                rx={0.5}
                fill={(r < 7 && c < 7) || (r < 7 && c >= sizeGrid - 7) || (r >= sizeGrid - 7 && c < 7) ? '#111827' : '#374151'}
              />
            );
          })
        )}

        {/* Central Crediver Rounded Badge */}
        <rect
          x={10 * cellSize}
          y={10 * cellSize}
          width={5 * cellSize}
          height={5 * cellSize}
          rx={4}
          fill="#1DB954"
        />
        
        {/* White core inside credentials wrapper */}
        <rect
          x={10.8 * cellSize}
          y={10.8 * cellSize}
          width={3.4 * cellSize}
          height={3.4 * cellSize}
          rx={3}
          fill="white"
        />

        {/* Crisp credit leaf icon SVG inside badge */}
        <path
          d={`M ${12.5*cellSize} ${11.5*cellSize} C ${13.5*cellSize} ${11.5*cellSize} ${14*cellSize} ${12.5*cellSize} ${12.5*cellSize} ${13.5*cellSize} C ${11.5*cellSize} ${12.5*cellSize} ${11.5*cellSize} ${11.5*cellSize} ${12.5*cellSize} ${11.5*cellSize} Z`}
          fill="#1DB954"
        />
        <line
          x1={12.5*cellSize}
          y1={13.5*cellSize}
          x2={12.5*cellSize}
          y2={12.0*cellSize}
          stroke="#1DB954"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
