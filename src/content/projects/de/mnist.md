---
slug: mnist
locale: de
title: MNIST Digit Recognition
summary: Bibliotheksfreies neuronales Netz in reinem TypeScript und JavaScript, das handgeschriebene Ziffern aus dem MNIST-Datensatz klassifiziert. Backpropagation und Forward-Propagation komplett von Hand implementiert.
role: Autor
status: live
statusLabel: Live
year: "2026"
featured: false
order: 5
tech:
  - TypeScript
  - JavaScript
  - Node.js
  - Neural Networks
  - Canvas
links:
  - label: Live-Demo
    url: https://digits.aneshodza.ch
  - label: GitHub
    url: https://github.com/aneshodza/mnist-digit-recognition
---

Ein vollständiges neuronales Netz zur Ziffernerkennung, ohne **TensorFlow**, **PyTorch** oder eine andere ML-Bibliothek. Forward- und Backpropagation sind in **TypeScript** und **JavaScript** von Grund auf implementiert, inklusive Aktivierungsfunktionen, Loss-Berechnung und Gradient-Updates.

Das Trainings-Backend läuft auf **Node.js**, das Web-Frontend bietet ein HTML5-Canvas, auf das gezeichnete Ziffern in einem MNIST-konformen Schritt zentriert (Schwerpunkt-Normalisierung) und auf 28 mal 28 Pixel skaliert werden, bevor sie dem Netz vorgelegt werden.

Auf einem Split von 50'000 Trainings- und 9'000 Testbildern erreicht das Netz rund 95 Prozent Genauigkeit. Ein Lernprojekt, dessen Wert genau im Verzicht auf Frameworks liegt.
