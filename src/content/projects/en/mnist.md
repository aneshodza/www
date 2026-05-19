---
slug: mnist
locale: en
title: MNIST Digit Recognition
summary: Library-free neural network in pure TypeScript and JavaScript that classifies handwritten digits from MNIST. Backpropagation and forward propagation implemented from scratch.
role: Author
status: live
statusLabel: Live
year: "2024"
featured: false
order: 5
tech:
  - TypeScript
  - JavaScript
  - Node.js
  - Neural Networks
  - Canvas
links:
  - label: Live demo
    url: https://digits.aneshodza.ch
  - label: GitHub
    url: https://github.com/aneshodza/mnist-digit-recognition
---

A full digit-recognition neural network without **TensorFlow**, **PyTorch**, or any other ML library. Forward and back propagation are implemented from scratch in **TypeScript** and **JavaScript**, including activations, loss, and gradient updates.

The training backend runs on **Node.js**. The web frontend offers an HTML5 canvas, and drawn digits go through a MNIST-style centre-of-mass normalisation and a 28 by 28 pixel resampling step before being fed to the network.

On a 50,000 train and 9,000 test split the network reaches roughly 95 percent precision. A learning project whose value lies precisely in not using a framework.
