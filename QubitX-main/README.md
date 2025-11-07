# QubitX - Interactive Qubit Visualization Tool

<div align="center">

![QubitX Logo](https://img.shields.io/badge/QubitX-Quantum%20Visualization-6366f1?style=for-the-badge&logo=atom&logoColor=white)

**An interactive educational platform for exploring quantum computing fundamentals through real-time 3D visualizations**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-f7df1e?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

[Live Demo](https://pritam9078.github.io/QubitX/) • [Features](#features) • [Getting Started](#getting-started) • [Documentation](#documentation)

</div>

## 🌟 Overview

QubitX is a cutting-edge interactive visualization tool designed to make quantum computing concepts accessible and engaging. Built with modern web technologies, it provides real-time 3D visualizations of quantum states, interactive qubit manipulation, and comprehensive educational content.

### 🎯 Core Educational Topics

1. **Qubits** - Fundamental units of quantum information
2. **Representing Qubit States** - Mathematical and visual representation
3. **Dirac Bra-Ket Notation** - Standard quantum mechanics notation
4. **Bloch Sphere Visualization** - 3D geometric representation of qubit states

## ✨ Features

### 🔬 Interactive Quantum Visualizations

- **3D Bloch Sphere** - Real-time visualization with enhanced animations
- **Probability Charts** - Dynamic measurement probability displays
- **State Vector Animation** - Smooth transitions between quantum states
- **Auto-Rotation** - Automated 3D sphere rotation for better perspective

### 🎮 Interactive Controls

- **Parameter Sliders** - Adjust θ (theta) and φ (phi) angles in real-time
- **Quantum Gates** - Apply Pauli-X, Y, Z, Hadamard, S, and T gates
- **Common States** - Quick access to |0⟩, |1⟩, |+⟩, |-⟩, |i+⟩, |i-⟩ states
- **Gate Animations** - Smooth animated transitions for gate applications

### 🎨 Modern UI/UX

- **Dark/Light Theme Toggle** - Seamless theme switching with persistent preferences
- **Responsive Design** - Perfect experience across desktop, tablet, and mobile
- **Glowing Aesthetics** - Beautiful quantum-inspired visual effects
- **Smooth Animations** - Professional transitions and hover effects

### 📚 Educational Content

- **Interactive Modals** - Detailed explanations for each core topic
- **Learning Pathways** - Structured progression from basic to advanced concepts
- **Visual Tooltips** - Contextual information throughout the interface
- **Mathematical Precision** - Accurate quantum mechanics calculations

### 🛠️ Technical Features

- **Real-time Updates** - Instant visualization updates with parameter changes
- **Performance Optimized** - Smooth 60fps animations and interactions
- **Accessibility** - Keyboard navigation and screen reader support
- **Cross-browser Compatible** - Works on all modern browsers

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No installation required - runs entirely in the browser

### Quick Start

1. **Clone or download** the repository:
   ```bash
   git clone https://github.com/Pritam9078/QubitX.git
   cd QubitX
   ```

2. **Open in browser**:
   ```bash
   # Simply open index.html in your preferred browser
   open index.html
   # or
   python -m http.server 8000  # For local server
   ```

3. **Start exploring**:
   - Use the parameter sliders to adjust qubit states
   - Apply quantum gates and observe state changes
   - Toggle between dark and light themes
   - Click on educational topics for detailed explanations

## 🎯 Usage Guide

### Basic Operations

#### Adjusting Qubit States
- **θ (Theta) Slider**: Controls polar angle (0 to π)
- **φ (Phi) Slider**: Controls azimuthal angle (0 to 2π)
- Watch real-time updates in the Bloch sphere and probability charts

#### Applying Quantum Gates
- **Pauli Gates** (X, Y, Z): Fundamental single-qubit operations
- **Hadamard Gate** (H): Creates superposition states
- **Phase Gates** (S, T): Apply quantum phase rotations

#### Visual Features
- **Auto-Rotate**: Enable automatic Bloch sphere rotation
- **Theme Toggle**: Switch between dark and light modes
- **Common States**: Quick access to important quantum states

### Advanced Features

#### Interactive Learning
- Click on **Core Topics** in the footer for detailed explanations
- Explore **Learning Pathways** for structured quantum education
- Use the **Quantum Basics** modal for fundamental concepts

#### State Analysis
- View detailed state information including:
  - Complex amplitude coefficients (α, β)
  - Measurement probabilities
  - Bloch sphere coordinates
  - Phase relationships

## 📖 Documentation

### Quantum Mechanics Concepts

#### Qubit States
A qubit state is represented as: `|ψ⟩ = α|0⟩ + β|1⟩`

Where:
- `α, β` are complex probability amplitudes
- `|α|² + |β|² = 1` (normalization condition)
- `|α|²` = probability of measuring |0⟩
- `|β|²` = probability of measuring |1⟩

#### Bloch Sphere Representation
Every qubit state corresponds to a point on the unit sphere:
- **North Pole**: |0⟩ state
- **South Pole**: |1⟩ state
- **Equator**: Superposition states
- **Coordinates**: (x, y, z) where x² + y² + z² = 1

#### Quantum Gates
- **X Gate**: Bit flip (|0⟩ ↔ |1⟩)
- **Y Gate**: Bit and phase flip
- **Z Gate**: Phase flip (|1⟩ → -|1⟩)
- **H Gate**: Hadamard (creates superposition)
- **S Gate**: Phase rotation by π/2
- **T Gate**: Phase rotation by π/4

### Technical Architecture

#### Core Technologies
- **HTML5**: Semantic structure and accessibility
- **CSS3**: Modern styling with custom properties and animations
- **Vanilla JavaScript**: ES6+ with modular architecture
- **Plotly.js**: High-performance 3D visualizations
- **Math.js**: Complex number arithmetic and calculations

#### File Structure
```
QubitX/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and themes
├── script.js           # Core JavaScript functionality
└── README.md           # This documentation
```

#### Key Classes and Functions
- `QubitState`: Quantum state representation and operations
- `QuantumGates`: Implementation of quantum gate operations
- `updateBlochSphere()`: Real-time 3D visualization updates
- `toggleTheme()`: Dark/light mode switching
- `animateGateTransition()`: Smooth gate application animations

## 🎨 Customization

### Theme Customization
The application uses CSS custom properties for easy theming:

```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
  --accent-color: #06b6d4;
  /* ... */
}
```

### Adding New Quantum Gates
```javascript
// Add to QuantumGates class
static customGate() {
    return [[a, b], [c, d]]; // 2x2 unitary matrix
}
```

### Extending Visualizations
The modular architecture allows easy extension of visualization capabilities.

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Contribution Guidelines
- Follow existing code style and structure
- Add comments for complex quantum mechanics calculations
- Test on multiple browsers and devices
- Update documentation for new features

### Areas for Contribution
- Additional quantum gates and operations
- Multi-qubit system support
- Quantum circuit builder interface
- Enhanced educational content
- Performance optimizations
- Accessibility improvements

## 📊 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 80+     | ✅ Full Support |
| Firefox | 75+     | ✅ Full Support |
| Safari  | 13+     | ✅ Full Support |
| Edge    | 80+     | ✅ Full Support |

## 🐛 Known Issues & Solutions

### Performance
- Large animation sequences may impact performance on older devices
- **Solution**: Reduce animation complexity in settings (future feature)

### Mobile Experience
- Complex interactions on very small screens
- **Solution**: Optimized touch interfaces and responsive design

## 📈 Roadmap

### Version 2.0 (Planned)
- [ ] Multi-qubit system visualization
- [ ] Quantum circuit builder
- [ ] Entanglement visualization
- [ ] Quantum algorithm demonstrations

### Version 2.1 (Future)
- [ ] Real quantum hardware integration
- [ ] Advanced gate sequences
- [ ] Quantum error correction visualization
- [ ] Collaborative learning features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Quantum Computing Community** for inspiration and feedback
- **Plotly.js Team** for excellent 3D visualization capabilities
- **Math.js Contributors** for robust mathematical operations
- **Web Standards Community** for modern browser capabilities

---

<div align="center">

**Built with ❤️ for quantum education**

*Making quantum computing accessible through interactive visualization*

</div>
