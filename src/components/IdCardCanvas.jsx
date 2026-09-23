import React, { useEffect, useRef } from 'react';
import { drawQRCodeOnCanvas } from '../utils/qrCode';

export function drawStudentBadgeOnCanvas(canvas, studentData) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = 600;
  const height = 920;

  canvas.width = width;
  canvas.height = height;

  const {
    id = 'MS26-998822',
    name = 'Student Name',
    email = 'student@example.com',
    phone = '9000000000',
    college = 'Tech Institute',
    yearOfStudy = '3rd Year',
    branch = 'CSE',
    seatNumber = '12',
    teamName = '',
    joiningType = 'solo',
    missionTrack = 'AI AGENTS',
    photoUrl = null
  } = studentData || {};

  // 1. Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#060B18');
  bgGrad.addColorStop(0.5, '#02040A');
  bgGrad.addColorStop(1, '#080E1E');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Cyber Grid lines
  ctx.strokeStyle = 'rgba(10, 132, 255, 0.08)';
  ctx.lineWidth = 1;
  const gridSize = 30;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Radial glowing spots behind photo and title
  const glow1 = ctx.createRadialGradient(width / 2, 240, 10, width / 2, 240, 240);
  glow1.addColorStop(0, 'rgba(0, 199, 181, 0.22)');
  glow1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, width, height);

  // 3. Card Outer Border with Glow
  ctx.save();
  ctx.strokeStyle = '#00C7B5';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(0, 199, 181, 0.6)';
  ctx.shadowBlur = 15;
  ctx.strokeRect(12, 12, width - 24, height - 24);
  ctx.restore();

  // Corner Accent Highlights
  const drawCorner = (x, y, r1, r2) => {
    ctx.strokeStyle = '#FFD600';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y + r2);
    ctx.lineTo(x, y);
    ctx.lineTo(x + r1, y);
    ctx.stroke();
  };
  drawCorner(20, 20, 40, 40);
  drawCorner(width - 20 - 40, 20, 40, -40);

  // 4. Lanyard Slot at top
  ctx.fillStyle = '#020205';
  ctx.fillRect(width / 2 - 40, 12, 80, 18);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  ctx.strokeRect(width / 2 - 35, 16, 70, 10);

  // 5. Header Banner: Organization Branding with Official Logo
  const logoX = width / 2 - 142;
  const logoY = 40;
  
  // Draw Official Medsquire Ribbon Stroke
  ctx.save();
  ctx.strokeStyle = '#0A84FF';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(logoX + 8, logoY + 9);
  ctx.lineTo(logoX + 18, logoY + 9);
  ctx.lineTo(logoX + 7, logoY + 15);
  ctx.lineTo(logoX + 17, logoY + 15);
  ctx.lineTo(logoX + 6, logoY + 21);
  ctx.stroke();

  // Cyan Dot
  ctx.fillStyle = '#00C7B5';
  ctx.beginPath();
  ctx.arc(logoX + 17, logoY + 4, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#0A84FF';
  ctx.font = '900 14px "Outfit", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('MEDSQUIRE TECHNOLOGIES PVT LTD', logoX + 26, 58);

  // Clean Event Title: AI SPRINT (White) + 2.0 (Yellow) - No Overlap!
  ctx.font = '900 34px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  
  // Render AI SPRINT 2.0 with distinct colors
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('AI SPRINT ', width / 2 - 30, 96);
  ctx.fillStyle = '#FFD600';
  ctx.fillText('2.0', width / 2 + 85, 96);

  // Workshop Subtitle
  ctx.fillStyle = '#00C7B5';
  ctx.font = '800 13px "Outfit", sans-serif';
  ctx.fillText('AI PRODUCT BUILDING WORKSHOP', width / 2, 122);

  ctx.fillStyle = '#A7AFBD';
  ctx.font = '600 11px "Inter", sans-serif';
  ctx.fillText('OFFICIAL STUDENT PARTICIPANT DELEGATE PASS', width / 2, 140);

  // Header Divider Line
  const lineGrad = ctx.createLinearGradient(40, 0, width - 40, 0);
  lineGrad.addColorStop(0, 'transparent');
  lineGrad.addColorStop(0.5, 'rgba(0, 199, 181, 0.6)');
  lineGrad.addColorStop(1, 'transparent');
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, 152);
  ctx.lineTo(width - 40, 152);
  ctx.stroke();

  // 6. Student Photo Area
  const photoSize = 150;
  const photoX = width / 2 - photoSize / 2;
  const photoY = 168;

  // Photo border & glow
  ctx.save();
  ctx.beginPath();
  ctx.arc(width / 2, photoY + photoSize / 2, photoSize / 2 + 5, 0, Math.PI * 2);
  ctx.strokeStyle = '#00C7B5';
  ctx.lineWidth = 4;
  ctx.shadowColor = '#00C7B5';
  ctx.shadowBlur = 12;
  ctx.stroke();
  ctx.restore();

  // Fallback silhouette
  const drawFallbackAvatar = () => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(width / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#0E172A';
    ctx.fill();
    ctx.clip();

    // Head
    ctx.fillStyle = '#0A84FF';
    ctx.beginPath();
    ctx.arc(width / 2, photoY + 55, 36, 0, Math.PI * 2);
    ctx.fill();

    // Shoulders
    ctx.beginPath();
    ctx.arc(width / 2, photoY + 160, 65, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  };

  if (photoUrl) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = photoUrl;
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
      ctx.restore();
    };
    img.onerror = () => {
      drawFallbackAvatar();
    };
  } else {
    drawFallbackAvatar();
  }

  // 7. Verified Seat Confirmation Ribbon
  ctx.fillStyle = 'rgba(0, 199, 181, 0.15)';
  ctx.strokeStyle = '#00C7B5';
  ctx.lineWidth = 1.5;
  const badgeW = 230;
  const badgeH = 28;
  const badgeX = width / 2 - badgeW / 2;
  const badgeY = photoY + photoSize + 12;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#00C7B5';
  ctx.font = '800 12px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`✓ CONFIRMED SEAT #${seatNumber} • DELEGATE`, width / 2, badgeY + 18);

  // 8. Student Name & Registration Details
  const detailsY = badgeY + 54;

  // Name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 26px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText((name || 'STUDENT NAME').toUpperCase(), width / 2, detailsY);

  // College & Year/Branch
  ctx.fillStyle = '#A7AFBD';
  ctx.font = '600 14px "Inter", sans-serif';
  ctx.fillText(college || 'College Name', width / 2, detailsY + 24);

  const academicInfo = `${yearOfStudy || 'Year'} ${branch ? '• ' + branch : ''}`;
  ctx.fillStyle = '#FFD600';
  ctx.font = '700 13px "Outfit", sans-serif';
  ctx.fillText(academicInfo.toUpperCase(), width / 2, detailsY + 44);

  // Key-Value Grid Box
  const boxX = 40;
  const boxY = detailsY + 60;
  const boxW = width - 80;
  const boxH = 150;

  ctx.fillStyle = 'rgba(8, 11, 18, 0.85)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 12);
  ctx.fill();
  ctx.stroke();

  // Grid details layout
  const col1X = boxX + 22;
  const col2X = boxX + boxW / 2 + 10;
  let row1Y = boxY + 32;
  let row2Y = boxY + 85;

  const drawPair = (lbl, val, x, y, valColor = '#FFFFFF') => {
    ctx.textAlign = 'left';
    ctx.fillStyle = '#7A8599';
    ctx.font = '700 11px "Outfit", sans-serif';
    ctx.fillText(lbl, x, y);
    ctx.fillStyle = valColor;
    ctx.font = '800 14px "Outfit", sans-serif';
    ctx.fillText(val || 'N/A', x, y + 18);
  };

  drawPair('REGISTRATION ID', id, col1X, row1Y, '#FFD600');
  drawPair('WORKSHOP SEAT', `SLOT #${seatNumber} (CONFIRMED)`, col2X, row1Y, '#00C7B5');

  drawPair('PHONE NUMBER', phone, col1X, row2Y, '#FFFFFF');
  drawPair('MISSION TRACK', (missionTrack || 'AI AGENTS').toUpperCase(), col2X, row2Y, '#0A84FF');

  // Bottom Footer Box (QR Code + Venue Info)
  const footerY = boxY + boxH + 18;
  const qrSize = 125;
  const qrX = boxX + 15;
  const qrY = footerY + 8;

  // Draw QR Code
  drawQRCodeOnCanvas(ctx, `ID:${id}|NAME:${name}|SEAT:${seatNumber}|WORKSHOP:AI_SPRINT_2.0`, qrX, qrY, qrSize, qrSize, '#00C7B5', '#040711');

  // Venue & Date Info next to QR Code
  const infoX = qrX + qrSize + 22;
  ctx.textAlign = 'left';

  ctx.fillStyle = '#FFD600';
  ctx.font = '900 14px "Outfit", sans-serif';
  ctx.fillText('WORKSHOP DATE & TIME', infoX, qrY + 20);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 13px "Inter", sans-serif';
  ctx.fillText('02 OCTOBER 2026', infoX, qrY + 38);

  ctx.fillStyle = '#A7AFBD';
  ctx.font = '600 12px "Inter", sans-serif';
  ctx.fillText('10:00 AM – 04:00 PM', infoX, qrY + 54);

  ctx.fillStyle = '#0A84FF';
  ctx.font = '900 14px "Outfit", sans-serif';
  ctx.fillText('VENUE LOCATION', infoX, qrY + 82);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 13px "Inter", sans-serif';
  ctx.fillText('ELURU, ANDHRA PRADESH', infoX, qrY + 100);

  // Security Hologram Bar at bottom
  const holoY = height - 42;
  const holoGrad = ctx.createLinearGradient(0, 0, width, 0);
  holoGrad.addColorStop(0, '#00C7B5');
  holoGrad.addColorStop(0.3, '#0A84FF');
  holoGrad.addColorStop(0.6, '#FFD600');
  holoGrad.addColorStop(1, '#00C7B5');

  ctx.fillStyle = holoGrad;
  ctx.fillRect(20, holoY, width - 40, 5);

  ctx.fillStyle = '#5A6578';
  ctx.font = '600 10px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SCAN QR CODE AT VENUE ENTRANCE FOR WORKSHOP ENTRY • MEDSQUIRE TECHNOLOGIES', width / 2, holoY + 20);
}

export default function IdCardCanvas({ studentData, onCanvasReady }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawStudentBadgeOnCanvas(canvasRef.current, studentData);
      if (onCanvasReady) {
        onCanvasReady(canvasRef.current);
      }
    }
  }, [studentData]);

  return (
    <div style={{ textAlign: 'center', margin: '0 auto' }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          maxWidth: '380px',
          height: 'auto',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 199, 181, 0.25)',
          border: '1px solid rgba(0, 199, 181, 0.4)',
          background: '#040711'
        }}
      />
    </div>
  );
}
