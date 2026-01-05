
import React, { useEffect, useRef } from 'react';

interface Props {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
  themeColor: string;
}

const Visualizer: React.FC<Props> = ({ analyser, isPlaying, themeColor }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser ? analyser.frequencyBinCount : 0;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(0, 0, width, height);

      if (!analyser || !isPlaying) {
        ctx.strokeStyle = themeColor + '33'; // Hex + alpha
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        return;
      }

      analyser.getByteFrequencyData(dataArray);

      const barWidth = (width / 40);
      let x = 0;

      for (let i = 0; i < 40; i++) {
        const index = Math.floor(i * (bufferLength / 80));
        const val = dataArray[index];
        const barHeight = (val / 255) * height;

        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, themeColor);
        gradient.addColorStop(1, '#ffffff');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);

        x += barWidth;
      }

      analyser.getByteTimeDomainData(dataArray);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      const sliceWidth = width * 1.0 / bufferLength;
      let waveX = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * height / 2;
        if (i === 0) ctx.moveTo(waveX, y);
        else ctx.lineTo(waveX, y);
        waveX += sliceWidth;
      }
      ctx.stroke();
    };

    draw();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyser, isPlaying, themeColor]);

  return (
    <canvas 
      ref={canvasRef} 
      width={320} 
      height={60} 
      className="w-full h-full block"
    />
  );
};

export default Visualizer;
