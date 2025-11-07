// Theme Management
const THEME_KEY = 'qubitx-theme';
const THEMES = {
    DARK: 'dark',
    LIGHT: 'light'
};

// Initialize theme on page load
function initializeTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = savedTheme || (prefersDark ? THEMES.DARK : THEMES.LIGHT);
    
    setTheme(defaultTheme);
}

// Set theme
function setTheme(theme) {
    if (theme === THEMES.LIGHT) {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    
    localStorage.setItem(THEME_KEY, theme);
    updateThemeIcon(theme);
    
    // Update Plotly charts for theme compatibility
    setTimeout(() => {
        updateChartsForTheme(theme);
    }, 100);
}

// Toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' 
        ? THEMES.LIGHT 
        : THEMES.DARK;
    
    const newTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
    setTheme(newTheme);
}

// Update theme toggle icon
function updateThemeIcon(theme) {
    const darkIcon = document.querySelector('.theme-icon-dark');
    const lightIcon = document.querySelector('.theme-icon-light');
    
    if (theme === THEMES.LIGHT) {
        darkIcon.style.opacity = '0';
        lightIcon.style.opacity = '1';
    } else {
        darkIcon.style.opacity = '1';
        lightIcon.style.opacity = '0';
    }
}

// Update Plotly charts for theme compatibility
function updateChartsForTheme(theme) {
    const isLight = theme === THEMES.LIGHT;
    const backgroundColor = isLight ? '#ffffff' : 'transparent';
    const textColor = isLight ? '#1e293b' : '#ffffff';
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
    
    // Update probability chart
    if (document.getElementById('probability-chart')) {
        Plotly.relayout('probability-chart', {
            'plot_bgcolor': backgroundColor,
            'paper_bgcolor': backgroundColor,
            'font.color': textColor,
            'xaxis.gridcolor': gridColor,
            'yaxis.gridcolor': gridColor,
            'xaxis.tickcolor': textColor,
            'yaxis.tickcolor': textColor
        });
    }
    
    // Update Bloch sphere
    if (document.getElementById('bloch-sphere')) {
        Plotly.relayout('bloch-sphere', {
            'plot_bgcolor': backgroundColor,
            'paper_bgcolor': backgroundColor,
            'font.color': textColor,
            'scene.xaxis.gridcolor': gridColor,
            'scene.yaxis.gridcolor': gridColor,
            'scene.zaxis.gridcolor': gridColor,
            'scene.xaxis.tickcolor': textColor,
            'scene.yaxis.tickcolor': textColor,
            'scene.zaxis.tickcolor': textColor
        });
    }
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
        setTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
    }
});

// Quantum State Class
class QubitState {
    constructor(alpha = 1, beta = 0) {
        this.alpha = math.complex(alpha);
        this.beta = math.complex(beta);
        this.normalize();
    }

    normalize() {
        const norm = Math.sqrt(
            Math.pow(math.abs(this.alpha), 2) + Math.pow(math.abs(this.beta), 2)
        );
        if (norm !== 0) {
            this.alpha = math.divide(this.alpha, norm);
            this.beta = math.divide(this.beta, norm);
        }
    }

    probability0() {
        return Math.pow(math.abs(this.alpha), 2);
    }

    probability1() {
        return Math.pow(math.abs(this.beta), 2);
    }

    toBlochCoordinates() {
        const theta = 2 * Math.acos(math.abs(this.alpha));
        let phi = 0;
        
        if (math.abs(this.beta) > 1e-10) {
            phi = math.arg(this.beta) - math.arg(this.alpha);
        }
        
        const x = Math.sin(theta) * Math.cos(phi);
        const y = Math.sin(theta) * Math.sin(phi);
        const z = Math.cos(theta);
        
        return { x, y, z, theta, phi };
    }

    toString() {
        const formatComplex = (c) => {
            // Handle both math.js complex objects and regular numbers
            let real, imag;
            
            if (typeof c === 'object' && c !== null) {
                // Math.js complex object
                real = c.re || 0;
                imag = c.im || 0;
            } else if (typeof c === 'number') {
                // Regular number
                real = c;
                imag = 0;
            } else {
                // Fallback
                real = 0;
                imag = 0;
            }
            
            if (Math.abs(imag) < 1e-10) {
                return real.toFixed(3);
            } else if (Math.abs(real) < 1e-10) {
                if (Math.abs(imag - 1) < 1e-10) return "i";
                if (Math.abs(imag + 1) < 1e-10) return "-i";
                return `${imag.toFixed(3)}i`;
            } else {
                const sign = imag >= 0 ? "+" : "";
                return `${real.toFixed(3)}${sign}${imag.toFixed(3)}i`;
            }
        };

        const alphaStr = formatComplex(this.alpha);
        const betaStr = formatComplex(this.beta);
        
        if (math.abs(this.alpha) < 1e-10) {
            return `|ψ⟩ = ${betaStr}|1⟩`;
        } else if (math.abs(this.beta) < 1e-10) {
            return `|ψ⟩ = ${alphaStr}|0⟩`;
        } else {
            // Handle complex number comparison properly
            const betaReal = (typeof this.beta === 'object' && this.beta.re !== undefined) ? this.beta.re : this.beta;
            const betaImag = (typeof this.beta === 'object' && this.beta.im !== undefined) ? this.beta.im : 0;
            const sign = (betaReal >= 0 || (betaReal === 0 && betaImag >= 0)) ? "+" : "";
            return `|ψ⟩ = ${alphaStr}|0⟩ ${sign}${betaStr}|1⟩`;
        }
    }
}

// Quantum Gates
class QuantumGates {
    static pauliX() {
        return [[0, 1], [1, 0]];
    }

    static pauliY() {
        return [[0, math.complex(0, -1)], [math.complex(0, 1), 0]];
    }

    static pauliZ() {
        return [[1, 0], [0, -1]];
    }

    static hadamard() {
        const inv_sqrt2 = 1 / Math.sqrt(2);
        return [[inv_sqrt2, inv_sqrt2], [inv_sqrt2, -inv_sqrt2]];
    }

    static sGate() {
        return [[1, 0], [0, math.complex(0, 1)]];
    }

    static tGate() {
        const phase = math.complex(Math.cos(Math.PI/4), Math.sin(Math.PI/4));
        return [[1, 0], [0, phase]];
    }

    static applyGate(gate, state) {
        const alpha = math.add(
            math.multiply(gate[0][0], state.alpha),
            math.multiply(gate[0][1], state.beta)
        );
        const beta = math.add(
            math.multiply(gate[1][0], state.alpha),
            math.multiply(gate[1][1], state.beta)
        );
        
        return new QubitState(alpha, beta);
    }
}

// Global state management
let currentState = new QubitState(1, 0);
let originalState = new QubitState(1, 0);

// DOM Elements
const thetaSlider = document.getElementById('theta-slider');
const phiSlider = document.getElementById('phi-slider');
const gateSelect = document.getElementById('gate-select');
const thetaValue = document.getElementById('theta-value');
const phiValue = document.getElementById('phi-value');
const stateDisplay = document.getElementById('state-display');
const amplitudesDisplay = document.getElementById('amplitudes-display');

// Initialize visualizations
function initializeVisualizations() {
    updateProbabilityChart();
    updateBlochSphere();
    updateStateDisplay();
}

// Update probability chart
function updateProbabilityChart() {
    const p0 = currentState.probability0();
    const p1 = currentState.probability1();

    const data = [{
        x: ['P(|0⟩)', 'P(|1⟩)'],
        y: [p0, p1],
        type: 'bar',
        marker: {
            color: ['rgba(99, 102, 241, 0.8)', 'rgba(139, 92, 246, 0.8)'],
            line: {
                color: ['rgb(99, 102, 241)', 'rgb(139, 92, 246)'],
                width: 2
            }
        },
        text: [p0.toFixed(3), p1.toFixed(3)],
        textposition: 'auto',
        textfont: {
            color: 'white',
            size: 14,
            family: 'Inter, sans-serif'
        },
        hovertemplate: 
            '<b>%{x}</b><br>' +
            'Probability: %{y:.4f}<br>' +
            'Percentage: %{customdata:.1f}%<br>' +
            '<extra></extra>',
        customdata: [p0 * 100, p1 * 100]
    }];

    const layout = {
        title: {
            text: 'Quantum Measurement Probabilities',
            font: { 
                color: 'white', 
                size: 14,
                family: 'Inter, sans-serif'
            },
            y: 0.95
        },
        xaxis: {
            color: 'white',
            gridcolor: 'rgba(255, 255, 255, 0.1)',
            tickfont: { family: 'Times New Roman, serif', size: 12 }
        },
        yaxis: {
            range: [0, 1.1],
            color: 'white',
            gridcolor: 'rgba(255, 255, 255, 0.1)',
            title: {
                text: 'Probability',
                font: { color: 'white', size: 12 }
            }
        },
        plot_bgcolor: 'transparent',
        paper_bgcolor: 'transparent',
        font: { color: 'white', family: 'Inter, sans-serif' },
        margin: { t: 40, b: 50, l: 60, r: 20 },
        showlegend: false,
        annotations: [{
            text: `Total Probability: ${(p0 + p1).toFixed(4)}`,
            x: 0.5,
            y: 1.05,
            xref: 'paper',
            yref: 'paper',
            showarrow: false,
            font: {
                color: '#06b6d4',
                size: 11
            }
        }]
    };

    Plotly.newPlot('probability-chart', data, layout, {
        displayModeBar: false,
        responsive: true,
        config: {
            staticPlot: false,
            editable: false,
            displaylogo: false
        }
    });
}

// Animation state tracking
let animationId = null;
let isAnimating = false;
let animationStartTime = null;
let previousState = null;
let targetState = null;

// Update Bloch sphere with animation
function updateBlochSphere(animate = true) {
    const coords = currentState.toBlochCoordinates();
    const { x, y, z } = coords;

    // Create enhanced sphere surface with more detail
    const phi = Array.from({length: 30}, (_, i) => i * Math.PI / 29);
    const theta = Array.from({length: 40}, (_, i) => i * 2 * Math.PI / 39);
    
    const sphereX = [];
    const sphereY = [];
    const sphereZ = [];
    
    for (let i = 0; i < phi.length; i++) {
        const row_x = [];
        const row_y = [];
        const row_z = [];
        for (let j = 0; j < theta.length; j++) {
            row_x.push(Math.sin(phi[i]) * Math.cos(theta[j]));
            row_y.push(Math.sin(phi[i]) * Math.sin(theta[j]));
            row_z.push(Math.cos(phi[i]));
        }
        sphereX.push(row_x);
        sphereY.push(row_y);
        sphereZ.push(row_z);
    }

    const data = [
        // Enhanced sphere surface with gradient effect
        {
            type: 'surface',
            x: sphereX,
            y: sphereY,
            z: sphereZ,
            opacity: 0.15,
            colorscale: [
                [0, 'rgba(99, 102, 241, 0.05)'], 
                [0.5, 'rgba(139, 92, 246, 0.1)'], 
                [1, 'rgba(99, 102, 241, 0.15)']
            ],
            showscale: false,
            hoverinfo: 'skip',
            lighting: {
                ambient: 0.8,
                diffuse: 0.8,
                specular: 0.2,
                roughness: 0.1
            }
        },
        // Enhanced coordinate axes with arrows
        {
            type: 'scatter3d',
            mode: 'lines',
            x: [-1.3, 1.3],
            y: [0, 0],
            z: [0, 0],
            line: { color: 'rgba(255, 255, 255, 0.4)', width: 3 },
            hoverinfo: 'skip',
            showlegend: false
        },
        {
            type: 'scatter3d',
            mode: 'lines',
            x: [0, 0],
            y: [-1.3, 1.3],
            z: [0, 0],
            line: { color: 'rgba(255, 255, 255, 0.4)', width: 3 },
            hoverinfo: 'skip',
            showlegend: false
        },
        {
            type: 'scatter3d',
            mode: 'lines',
            x: [0, 0],
            y: [0, 0],
            z: [-1.3, 1.3],
            line: { color: 'rgba(255, 255, 255, 0.4)', width: 3 },
            hoverinfo: 'skip',
            showlegend: false
        },
        // Animated state vector with glow effect
        {
            type: 'scatter3d',
            mode: 'lines+markers',
            x: [0, x],
            y: [0, y],
            z: [0, z],
            line: { 
                color: 'rgb(239, 68, 68)', 
                width: 10
            },
            marker: { 
                size: [0, 12], 
                color: ['rgb(239, 68, 68)', 'rgb(255, 100, 100)'],
                symbol: ['circle', 'circle'],
                line: {
                    color: 'rgb(255, 150, 150)',
                    width: 2
                }
            },
            hovertemplate: `<b>Qubit State Vector</b><br>` +
                          `X: ${x.toFixed(3)}<br>` +
                          `Y: ${y.toFixed(3)}<br>` +
                          `Z: ${z.toFixed(3)}<br>` +
                          `<i>Magnitude: ${Math.sqrt(x*x + y*y + z*z).toFixed(3)}</i><extra></extra>`,
            showlegend: false
        },
        // State vector projection on XY plane (animated)
        {
            type: 'scatter3d',
            mode: 'lines+markers',
            x: [0, x],
            y: [0, y],
            z: [0, 0],
            line: { 
                color: 'rgba(6, 182, 212, 0.6)', 
                width: 4,
                dash: 'dot'
            },
            marker: { 
                size: [0, 6], 
                color: ['rgba(6, 182, 212, 0.6)', 'rgba(6, 182, 212, 0.8)']
            },
            hovertemplate: `<b>XY Projection</b><br>X: ${x.toFixed(3)}<br>Y: ${y.toFixed(3)}<extra></extra>`,
            showlegend: false
        },
        // Enhanced equatorial circle
        {
            type: 'scatter3d',
            mode: 'lines',
            x: Array.from({length: 100}, (_, i) => Math.cos(2 * Math.PI * i / 99)),
            y: Array.from({length: 100}, (_, i) => Math.sin(2 * Math.PI * i / 99)),
            z: Array.from({length: 100}, () => 0),
            line: { color: 'rgba(6, 182, 212, 0.7)', width: 3 },
            hoverinfo: 'skip',
            showlegend: false
        },
        // Meridian circles for better depth perception
        {
            type: 'scatter3d',
            mode: 'lines',
            x: Array.from({length: 100}, (_, i) => Math.cos(2 * Math.PI * i / 99)),
            y: Array.from({length: 100}, () => 0),
            z: Array.from({length: 100}, (_, i) => Math.sin(2 * Math.PI * i / 99)),
            line: { color: 'rgba(139, 92, 246, 0.3)', width: 2 },
            hoverinfo: 'skip',
            showlegend: false
        },
        {
            type: 'scatter3d',
            mode: 'lines',
            x: Array.from({length: 100}, () => 0),
            y: Array.from({length: 100}, (_, i) => Math.cos(2 * Math.PI * i / 99)),
            z: Array.from({length: 100}, (_, i) => Math.sin(2 * Math.PI * i / 99)),
            line: { color: 'rgba(139, 92, 246, 0.3)', width: 2 },
            hoverinfo: 'skip',
            showlegend: false
        }
    ];

    const layout = {
        title: {
            text: `<b>3D Bloch Sphere Visualization</b><br><span style="font-size:11px; color:#06b6d4;">θ=${coords.theta.toFixed(3)} rad (${(coords.theta * 180 / Math.PI).toFixed(1)}°), φ=${coords.phi.toFixed(3)} rad (${(coords.phi * 180 / Math.PI).toFixed(1)}°)</span>`,
            font: { color: 'white', size: 14, family: 'Inter, sans-serif' }
        },
        scene: {
            xaxis: { 
                range: [-1.4, 1.4], 
                showgrid: true, 
                gridcolor: 'rgba(255, 255, 255, 0.15)',
                showticklabels: true,
                tickcolor: 'rgba(255, 255, 255, 0.6)',
                zeroline: true,
                zerolinecolor: 'rgba(255, 255, 255, 0.5)',
                title: {
                    text: 'X',
                    font: { color: 'white', size: 12 }
                },
                backgroundcolor: 'transparent'
            },
            yaxis: { 
                range: [-1.4, 1.4], 
                showgrid: true, 
                gridcolor: 'rgba(255, 255, 255, 0.15)',
                showticklabels: true,
                tickcolor: 'rgba(255, 255, 255, 0.6)',
                zeroline: true,
                zerolinecolor: 'rgba(255, 255, 255, 0.5)',
                title: {
                    text: 'Y',
                    font: { color: 'white', size: 12 }
                },
                backgroundcolor: 'transparent'
            },
            zaxis: { 
                range: [-1.4, 1.4], 
                showgrid: true, 
                gridcolor: 'rgba(255, 255, 255, 0.15)',
                showticklabels: true,
                tickcolor: 'rgba(255, 255, 255, 0.6)',
                zeroline: true,
                zerolinecolor: 'rgba(255, 255, 255, 0.5)',
                title: {
                    text: 'Z',
                    font: { color: 'white', size: 12 }
                },
                backgroundcolor: 'transparent'
            },
            bgcolor: 'transparent',
            aspectmode: 'cube',
            camera: {
                eye: { x: 1.6, y: 1.6, z: 1.2 },
                up: { x: 0, y: 0, z: 1 },
                center: { x: 0, y: 0, z: 0 }
            }
        },
        plot_bgcolor: 'transparent',
        paper_bgcolor: 'transparent',
        font: { color: 'white', family: 'Inter, sans-serif' },
        margin: { t: 70, b: 20, l: 20, r: 20 },
        annotations: [
            {
                text: "<b>|0⟩</b>",
                x: 0.5, y: 0.95,
                xref: 'paper', yref: 'paper',
                showarrow: false,
                font: { color: '#10b981', size: 16, family: 'Times New Roman, serif' },
                bgcolor: 'rgba(16, 185, 129, 0.1)',
                bordercolor: '#10b981',
                borderwidth: 1
            },
            {
                text: "<b>|1⟩</b>",
                x: 0.5, y: 0.05,
                xref: 'paper', yref: 'paper',
                showarrow: false,
                font: { color: '#ef4444', size: 16, family: 'Times New Roman, serif' },
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                bordercolor: '#ef4444',
                borderwidth: 1
            },
            {
                text: "<b>|+⟩</b>",
                x: 0.95, y: 0.5,
                xref: 'paper', yref: 'paper',
                showarrow: false,
                font: { color: '#06b6d4', size: 14, family: 'Times New Roman, serif' },
                bgcolor: 'rgba(6, 182, 212, 0.1)',
                bordercolor: '#06b6d4',
                borderwidth: 1
            },
            {
                text: "<b>|-⟩</b>",
                x: 0.05, y: 0.5,
                xref: 'paper', yref: 'paper',
                showarrow: false,
                font: { color: '#06b6d4', size: 14, family: 'Times New Roman, serif' },
                bgcolor: 'rgba(6, 182, 212, 0.1)',
                bordercolor: '#06b6d4',
                borderwidth: 1
            }
        ]
    };

    // Animation configuration
    const animationConfig = animate ? {
        transition: {
            duration: 800,
            easing: 'cubic-in-out'
        },
        frame: {
            duration: 800,
            redraw: true
        }
    } : {};

    const plotConfig = {
        displayModeBar: false,
        responsive: true,
        config: {
            staticPlot: false,
            editable: false,
            displaylogo: false,
            toImageButtonOptions: {
                format: 'png',
                filename: 'bloch_sphere_animation',
                height: 600,
                width: 600,
                scale: 2
            }
        }
    };

    if (animate && document.getElementById('bloch-sphere').data) {
        // Use animate for smooth transitions
        Plotly.animate('bloch-sphere', {
            data: data,
            layout: layout
        }, animationConfig);
    } else {
        // Initial plot or when animation is disabled
        Plotly.newPlot('bloch-sphere', data, layout, plotConfig);
    }
}

// Update state display
function updateStateDisplay() {
    stateDisplay.textContent = currentState.toString();
    
    // Extract real and imaginary parts safely
    const alphaReal = (typeof currentState.alpha === 'object' && currentState.alpha.re !== undefined) ? currentState.alpha.re : (typeof currentState.alpha === 'number' ? currentState.alpha : 0);
    const alphaImag = (typeof currentState.alpha === 'object' && currentState.alpha.im !== undefined) ? currentState.alpha.im : 0;
    const betaReal = (typeof currentState.beta === 'object' && currentState.beta.re !== undefined) ? currentState.beta.re : (typeof currentState.beta === 'number' ? currentState.beta : 0);
    const betaImag = (typeof currentState.beta === 'object' && currentState.beta.im !== undefined) ? currentState.beta.im : 0;
    
    // Update amplitudes
    amplitudesDisplay.innerHTML = `
        α = ${alphaReal.toFixed(3)}${alphaImag >= 0 ? '+' : ''}${alphaImag.toFixed(3)}i<br>
        β = ${betaReal.toFixed(3)}${betaImag >= 0 ? '+' : ''}${betaImag.toFixed(3)}i
    `;
    
    // Update magnitudes
    const alphaMag = math.abs(currentState.alpha);
    const betaMag = math.abs(currentState.beta);
    document.getElementById('magnitudes-display').innerHTML = `
        |α| = ${alphaMag.toFixed(3)}<br>
        |β| = ${betaMag.toFixed(3)}
    `;
    
    // Update phases
    const alphaPhase = math.arg(currentState.alpha);
    const betaPhase = math.arg(currentState.beta);
    document.getElementById('phases-display').innerHTML = `
        arg(α) = ${alphaPhase.toFixed(3)} rad<br>
        arg(β) = ${betaPhase.toFixed(3)} rad
    `;
    
    // Update probability details
    const p0 = currentState.probability0();
    const p1 = currentState.probability1();
    const total = p0 + p1;
    
    document.getElementById('prob-0-value').textContent = p0.toFixed(3);
    document.getElementById('prob-1-value').textContent = p1.toFixed(3);
    document.getElementById('prob-total').textContent = total.toFixed(3);
    document.getElementById('prob-0-percent').textContent = `(${(p0 * 100).toFixed(1)}%)`;
    document.getElementById('prob-1-percent').textContent = `(${(p1 * 100).toFixed(1)}%)`;
    
    // Update Bloch sphere coordinates
    const coords = currentState.toBlochCoordinates();
    const { x, y, z, theta, phi } = coords;
    
    document.getElementById('theta-display').textContent = theta.toFixed(3);
    document.getElementById('phi-display').textContent = phi.toFixed(3);
    document.getElementById('theta-degrees').textContent = `(${(theta * 180 / Math.PI).toFixed(1)}°)`;
    document.getElementById('phi-degrees').textContent = `(${(phi * 180 / Math.PI).toFixed(1)}°)`;
    document.getElementById('x-coord').textContent = x.toFixed(3);
    document.getElementById('y-coord').textContent = y.toFixed(3);
    document.getElementById('z-coord').textContent = z.toFixed(3);
}

// Animation controls
let autoRotateEnabled = false;
let rotationAngle = 0;
let rotationSpeed = 0.01;

// Auto-rotation animation
function startAutoRotation() {
    if (!autoRotateEnabled) return;
    
    rotationAngle += rotationSpeed;
    const camera = {
        eye: {
            x: 1.6 * Math.cos(rotationAngle),
            y: 1.6 * Math.sin(rotationAngle),
            z: 1.2
        },
        up: { x: 0, y: 0, z: 1 },
        center: { x: 0, y: 0, z: 0 }
    };
    
    if (document.getElementById('bloch-sphere').data) {
        Plotly.relayout('bloch-sphere', {
            'scene.camera': camera
        });
    }
    
    if (autoRotateEnabled) {
        requestAnimationFrame(startAutoRotation);
    }
}

// Toggle auto-rotation
function toggleAutoRotation() {
    autoRotateEnabled = !autoRotateEnabled;
    const button = document.getElementById('auto-rotate-btn');
    if (autoRotateEnabled) {
        button.textContent = 'Stop Rotation';
        button.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        startAutoRotation();
    } else {
        button.textContent = 'Auto Rotate';
        button.style.background = 'linear-gradient(135deg, #06b6d4, #0891b2)';
    }
}

// Animate gate application with trajectory
function animateGateTransition(fromState, toState, gateName, duration = 1500) {
    if (isAnimating) return;
    
    isAnimating = true;
    const startTime = Date.now();
    const steps = 60; // Animation frames
    
    // Temporarily disable auto-rotation during gate animation
    const wasAutoRotating = autoRotateEnabled;
    if (autoRotateEnabled) {
        autoRotateEnabled = false;
    }
    
    function animateStep() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Smooth easing function
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        // Interpolate between states
        const alphaReal = fromState.alpha.re + (toState.alpha.re - fromState.alpha.re) * easedProgress;
        const alphaImag = fromState.alpha.im + (toState.alpha.im - fromState.alpha.im) * easedProgress;
        const betaReal = fromState.beta.re + (toState.beta.re - fromState.beta.re) * easedProgress;
        const betaImag = fromState.beta.im + (toState.beta.im - fromState.beta.im) * easedProgress;
        
        const interpolatedState = new QubitState(
            math.complex(alphaReal, alphaImag),
            math.complex(betaReal, betaImag)
        );
        
        // Update visualization with interpolated state
        currentState = interpolatedState;
        updateBlochSphere(false); // Disable internal animation during transition
        updateProbabilityChart();
        updateStateDisplay();
        
        if (progress < 1) {
            requestAnimationFrame(animateStep);
        } else {
            // Animation complete
            currentState = toState;
            updateVisualizations();
            isAnimating = false;
            
            // Restore auto-rotation if it was enabled
            if (wasAutoRotating) {
                autoRotateEnabled = true;
                startAutoRotation();
            }
            
            // Show completion effect
            showGateApplicationEffect(gateName);
        }
    }
    
    animateStep();
}

// Visual effect for gate application
function showGateApplicationEffect(gateName) {
    const effect = document.createElement('div');
    effect.className = 'gate-effect';
    effect.textContent = `${gateName} Gate Applied!`;
    effect.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #06b6d4, #3b82f6);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-weight: bold;
        font-size: 16px;
        box-shadow: 0 8px 32px rgba(6, 182, 212, 0.3);
        z-index: 10000;
        animation: gateEffectAnim 2s ease-out forwards;
        pointer-events: none;
    `;
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    }, 2000);
}

// Update visualizations
function updateVisualizations() {
    updateProbabilityChart();
    updateBlochSphere(true);
    updateStateDisplay();
}

// Create state from spherical coordinates
function createStateFromAngles(theta, phi) {
    const alpha = Math.cos(theta / 2);
    const beta = math.multiply(
        math.complex(Math.cos(phi), Math.sin(phi)),
        Math.sin(theta / 2)
    );
    return new QubitState(alpha, beta);
}

// Apply selected gate with animation
function applySelectedGate() {
    const gateType = gateSelect.value;
    let gate;
    let gateName = 'Identity';
    
    switch (gateType) {
        case 'x':
            gate = QuantumGates.pauliX();
            gateName = 'Pauli-X';
            break;
        case 'y':
            gate = QuantumGates.pauliY();
            gateName = 'Pauli-Y';
            break;
        case 'z':
            gate = QuantumGates.pauliZ();
            gateName = 'Pauli-Z';
            break;
        case 'h':
            gate = QuantumGates.hadamard();
            gateName = 'Hadamard';
            break;
        case 's':
            gate = QuantumGates.sGate();
            gateName = 'S';
            break;
        case 't':
            gate = QuantumGates.tGate();
            gateName = 'T';
            break;
        default:
            currentState = new QubitState(originalState.alpha, originalState.beta);
            updateVisualizations();
            return;
    }
    
    const newState = QuantumGates.applyGate(gate, originalState);
    
    // Use animation if gate changes the state significantly
    if (gateType !== 'none' && !isAnimating) {
        animateGateTransition(currentState, newState, gateName);
    } else {
        currentState = newState;
        updateVisualizations();
    }
}

// Set specific state with detailed information display
function setState(theta, phi, stateName = '') {
    thetaSlider.value = theta;
    phiSlider.value = phi;
    thetaValue.textContent = theta.toFixed(3);
    phiValue.textContent = phi.toFixed(3);
    
    originalState = createStateFromAngles(theta, phi);
    applySelectedGate();
    
    // Note: Removed modal popup to improve user experience
    // Users can see the state information in the main visualization panels
}

// Show detailed information for a specific state
function showStateInformation(stateName, theta, phi) {
    const state = createStateFromAngles(theta, phi);
    const coords = state.toBlochCoordinates();
    const p0 = state.probability0();
    const p1 = state.probability1();
    
    // Create information modal or panel
    const infoPanel = document.createElement('div');
    infoPanel.className = 'state-info-modal';
    infoPanel.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Quantum State: ${stateName}</h3>
                <button class="close-btn" onclick="closeStateInfo()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="state-details-grid">
                    <div class="detail-section">
                        <h4>State Representation</h4>
                        <p><strong>Dirac Notation:</strong> ${state.toString()}</p>
                        <p><strong>Spherical:</strong> θ = ${theta.toFixed(3)} rad (${(theta * 180 / Math.PI).toFixed(1)}°)</p>
                        <p><strong>Azimuthal:</strong> φ = ${phi.toFixed(3)} rad (${(phi * 180 / Math.PI).toFixed(1)}°)</p>
                    </div>
                    <div class="detail-section">
                        <h4>Measurement Probabilities</h4>
                        <p><strong>P(|0⟩):</strong> ${p0.toFixed(4)} (${(p0 * 100).toFixed(1)}%)</p>
                        <p><strong>P(|1⟩):</strong> ${p1.toFixed(4)} (${(p1 * 100).toFixed(1)}%)</p>
                        <p><strong>Total:</strong> ${(p0 + p1).toFixed(4)}</p>
                    </div>
                    <div class="detail-section">
                        <h4>Bloch Sphere Coordinates</h4>
                        <p><strong>X:</strong> ${coords.x.toFixed(4)}</p>
                        <p><strong>Y:</strong> ${coords.y.toFixed(4)}</p>
                        <p><strong>Z:</strong> ${coords.z.toFixed(4)}</p>
                    </div>
                    <div class="detail-section">
                        <h4>Physical Interpretation</h4>
                        <p>${getStateInterpretation(stateName, p0, p1, coords)}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(infoPanel);
    
    // Add event listener to close modal when clicking outside
    infoPanel.addEventListener('click', function(e) {
        if (e.target === infoPanel) {
            closeStateInfo();
        }
    });
}

// Get physical interpretation of the state
function getStateInterpretation(stateName, p0, p1, coords) {
    const interpretations = {
        'Ground State |0⟩': 'This is the computational basis state |0⟩. The qubit is definitely in the ground state with 100% probability. Located at the north pole of the Bloch sphere.',
        'Excited State |1⟩': 'This is the computational basis state |1⟩. The qubit is definitely in the excited state with 100% probability. Located at the south pole of the Bloch sphere.',
        'Plus State |+⟩': 'This is an equal superposition state. The qubit has 50% probability of being measured in |0⟩ or |1⟩. Located on the positive X-axis of the Bloch sphere.',
        'Minus State |-⟩': 'This is an equal superposition with negative phase. Same measurement probabilities as |+⟩ but with opposite phase relationship. Located on the negative X-axis.',
        'Y+ State |i+⟩': 'This state has equal probabilities but includes a complex phase (i). The imaginary phase creates quantum interference effects. Located on the positive Y-axis.',
        'Y- State |i-⟩': 'Similar to |i+⟩ but with negative imaginary phase (-i). Equal measurement probabilities with different phase relationship. Located on the negative Y-axis.'
    };
    
    return interpretations[stateName] || 'This quantum state demonstrates the superposition principle and quantum interference effects.';
}

// Close state information modal
function closeStateInfo() {
    const modal = document.querySelector('.state-info-modal');
    if (modal) {
        modal.remove();
    }
}

// Show solution for exercises
function showSolution(exerciseNumber) {
    const solution = document.getElementById(`solution-${exerciseNumber}`);
    solution.classList.toggle('hidden');
}

// Smooth scrolling
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme first
    initializeTheme();
    
    // Initialize visualizations
    initializeVisualizations();
    
    // Slider event listeners
    thetaSlider.addEventListener('input', function() {
        const theta = parseFloat(this.value);
        const phi = parseFloat(phiSlider.value);
        thetaValue.textContent = theta.toFixed(3);
        
        originalState = createStateFromAngles(theta, phi);
        applySelectedGate();
    });
    
    phiSlider.addEventListener('input', function() {
        const theta = parseFloat(thetaSlider.value);
        const phi = parseFloat(this.value);
        phiValue.textContent = phi.toFixed(3);
        
        originalState = createStateFromAngles(theta, phi);
        applySelectedGate();
    });
    
    // Gate selection event listener
    gateSelect.addEventListener('change', applySelectedGate);
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 15, 35, 0.98)';
        } else {
            navbar.style.background = 'rgba(15, 15, 35, 0.95)';
        }
    });
    
    // Smooth scrolling for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
});

// Window resize handler for responsive charts
window.addEventListener('resize', function() {
    setTimeout(() => {
        Plotly.Plots.resize('probability-chart');
        Plotly.Plots.resize('bloch-sphere');
    }, 100);
});

// Quantum Basics Modal Functions
function openQuantumBasicsModal() {
    const modal = document.getElementById('quantumBasicsModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeQuantumBasicsModal() {
    const modal = document.getElementById('quantumBasicsModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close modal when clicking outside or pressing Escape
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('quantumBasicsModal');
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeQuantumBasicsModal();
        }
    });
    
    // Prevent modal content clicks from closing the modal
    const modalContainer = modal.querySelector('.modal-container');
    modalContainer.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});

// Topic Information Modal System
const topicData = {
    qubits: {
        title: "Qubits - Quantum Information Units",
        content: `
            <div class="topic-content-section">
                <h3><i class="fas fa-atom"></i> What are Qubits?</h3>
                <p>A qubit (quantum bit) is the fundamental unit of quantum information. Unlike classical bits that can only exist in states 0 or 1, qubits can exist in a <strong>superposition</strong> of both states simultaneously.</p>
                
                <div class="topic-highlight">
                    <p>Think of a spinning coin in the air - it's neither heads nor tails until it lands. Similarly, a qubit exists in all possible states until measured.</p>
                </div>
            </div>

            <div class="topic-content-section">
                <h4><i class="fas fa-layer-group"></i> Key Properties</h4>
                <ul>
                    <li><strong>Superposition:</strong> Can be in multiple states at once</li>
                    <li><strong>Coherence:</strong> Maintains quantum properties for a limited time</li>
                    <li><strong>Entanglement:</strong> Can be quantum mechanically linked with other qubits</li>
                    <li><strong>Measurement:</strong> Collapses to either |0⟩ or |1⟩ state</li>
                </ul>
            </div>

            <div class="topic-content-section">
                <h4><i class="fas fa-microchip"></i> Physical Implementations</h4>
                <ul>
                    <li>Superconducting circuits (IBM, Google)</li>
                    <li>Trapped ions (IonQ, Honeywell)</li>
                    <li>Photonic qubits (Xanadu, PsiQuantum)</li>
                    <li>Silicon quantum dots (Intel)</li>
                    <li>Neutral atoms (Atom Computing)</li>
                </ul>
            </div>
        `
    },
    states: {
        title: "Representing Qubit States",
        content: `
            <div class="topic-content-section">
                <h3><i class="fas fa-wave-square"></i> Mathematical Representation</h3>
                <p>A qubit state is mathematically represented as a linear combination of basis states |0⟩ and |1⟩:</p>
                <div class="topic-highlight">
                    <p>|ψ⟩ = α|0⟩ + β|1⟩</p>
                </div>
                <p>Where α and β are complex numbers called <strong>probability amplitudes</strong>, and |α|² + |β|² = 1.</p>
            </div>

            <div class="topic-content-section">
                <h4><i class="fas fa-chart-pie"></i> Probability Interpretation</h4>
                <ul>
                    <li><strong>|α|²:</strong> Probability of measuring |0⟩</li>
                    <li><strong>|β|²:</strong> Probability of measuring |1⟩</li>
                    <li><strong>Phase:</strong> Relative phase between α and β affects quantum interference</li>
                    <li><strong>Global Phase:</strong> Overall phase doesn't affect measurement probabilities</li>
                </ul>
            </div>

            <div class="topic-content-section">
                <h4><i class="fas fa-star"></i> Common Quantum States</h4>
                <ul>
                    <li><strong>|0⟩:</strong> Ground state (α=1, β=0)</li>
                    <li><strong>|1⟩:</strong> Excited state (α=0, β=1)</li>
                    <li><strong>|+⟩:</strong> Superposition (α=1/√2, β=1/√2)</li>
                    <li><strong>|-⟩:</strong> Superposition (α=1/√2, β=-1/√2)</li>
                    <li><strong>|i+⟩:</strong> Circular polarization (α=1/√2, β=i/√2)</li>
                </ul>
            </div>
        `
    },
    dirac: {
        title: "Dirac Bra-Ket Notation",
        content: `
            <div class="topic-content-section">
                <h3><i class="fas fa-code"></i> The Language of Quantum Mechanics</h3>
                <p>Dirac notation, invented by physicist Paul Dirac, provides a concise way to express quantum states and operations. It's the standard mathematical language of quantum mechanics.</p>
            </div>

            <div class="topic-content-section">
                <h4><i class="fas fa-angle-right"></i> Ket Notation |ψ⟩</h4>
                <ul>
                    <li><strong>Ket:</strong> Represents a quantum state vector</li>
                    <li><strong>Example:</strong> |0⟩, |1⟩, |+⟩, |ψ⟩</li>
                    <li><strong>Vector Space:</strong> Lives in a complex Hilbert space</li>
                    <li><strong>Normalization:</strong> ⟨ψ|ψ⟩ = 1</li>
                </ul>
            </div>

            <div class="topic-content-section">
                <h4><i class="fas fa-angle-left"></i> Bra Notation ⟨φ|</h4>
                <ul>
                    <li><strong>Bra:</strong> Complex conjugate transpose of a ket</li>
                    <li><strong>Dual Vector:</strong> Lives in the dual Hilbert space</li>
                    <li><strong>Example:</strong> If |ψ⟩ = α|0⟩ + β|1⟩, then ⟨ψ| = α*⟨0| + β*⟨1|</li>
                </ul>
            </div>

            <div class="topic-content-section">
                <h4><i class="fas fa-times"></i> Bracket ⟨φ|ψ⟩</h4>
                <div class="topic-highlight">
                    <p>The inner product between two quantum states, representing the probability amplitude of measuring state |φ⟩ when the system is in state |ψ⟩.</p>
                </div>
                <ul>
                    <li><strong>Orthogonal States:</strong> ⟨0|1⟩ = 0</li>
                    <li><strong>Normalization:</strong> ⟨0|0⟩ = ⟨1|1⟩ = 1</li>
                    <li><strong>Probability:</strong> |⟨φ|ψ⟩|² gives measurement probability</li>
                </ul>
            </div>
        `
    },
    bloch: {
        title: "Bloch Sphere Visualization",
        content: `
            <div class="topic-content-section">
                <h3><i class="fas fa-globe"></i> Geometric Representation of Qubits</h3>
                <p>The Bloch sphere is a geometric representation of qubit states as points on a unit sphere. Every possible qubit state corresponds to a unique point on this sphere.</p>
                
                <div class="topic-highlight">
                    <p>It provides an intuitive way to visualize quantum operations as rotations in 3D space.</p>
                </div>
            </div>

            <div class="topic-content-section">
                <h4><i class="fas fa-map-marked"></i> Sphere Coordinates</h4>
                <ul>
                    <li><strong>North Pole (0,0,1):</strong> |0⟩ state</li>
                    <li><strong>South Pole (0,0,-1):</strong> |1⟩ state</li>
                    <li><strong>X-axis (±1,0,0):</strong> |+⟩ and |-⟩ states</li>
                    <li><strong>Y-axis (0,±1,0):</strong> |i+⟩ and |i-⟩ states</li>
                    <li><strong>Interior Points:</strong> Mixed (classical) states</li>
                </ul>
            </div>

            <div class="topic-content-section">
                <h4><i class="fas fa-sync-alt"></i> Quantum Gates as Rotations</h4>
                <ul>
                    <li><strong>X Gate:</strong> 180° rotation around X-axis (bit flip)</li>
                    <li><strong>Y Gate:</strong> 180° rotation around Y-axis</li>
                    <li><strong>Z Gate:</strong> 180° rotation around Z-axis (phase flip)</li>
                    <li><strong>Hadamard:</strong> 180° rotation around X+Z axis</li>
                    <li><strong>T/S Gates:</strong> Rotations around Z-axis by π/4 and π/2</li>
                </ul>
            </div>

            <div class="topic-content-section">
                <h4><i class="fas fa-ruler"></i> Spherical Coordinates</h4>
                <p>Any point on the Bloch sphere can be parameterized using spherical coordinates:</p>
                <ul>
                    <li><strong>θ (theta):</strong> Polar angle (0 to π)</li>
                    <li><strong>φ (phi):</strong> Azimuthal angle (0 to 2π)</li>
                    <li><strong>State:</strong> |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩</li>
                </ul>
            </div>
        `
    }
};

const learningData = {
    basic: {
        title: "Basic Concepts - Foundation of Quantum Computing",
        content: `
            <div class="topic-content-section">
                <h3><i class="fas fa-graduation-cap"></i> Essential Quantum Concepts</h3>
                <p>Start your quantum journey by understanding the fundamental principles that make quantum computing so powerful and different from classical computing.</p>
            </div>

            <div class="topic-content-section">
                <h4><i class="fas fa-lightbulb"></i> Core Principles</h4>
                <ul>
                    <li><strong>Superposition:</strong> Quantum systems can exist in multiple states simultaneously</li>
                    <li><strong>Entanglement:</strong> Quantum particles can be correlated in ways impossible classically</li>
                    <li><strong>Interference:</strong> Quantum amplitudes can add constructively or destructively</li>
                    <li><strong>Measurement:</strong> Observing a quantum system changes its state</li>
                </ul>
            </div>

            <div class="topic-content-section">
                <h4><i class="fas fa-route"></i> Learning Sequence</h4>
                <ul>
                    <li>Understand classical bits vs quantum qubits</li>
                    <li>Learn about quantum states and superposition</li>
                    <li>Explore the mathematics of complex numbers</li>
                    <li>Study the postulates of quantum mechanics</li>
                    <li>Practice with simple quantum circuits</li>
                </ul>
            </div>

            <div class="topic-content-section">
                <h4><i class="fas fa-tools"></i> Prerequisites</h4>
                <div class="topic-highlight">
                    <p>Linear algebra, complex numbers, and basic probability theory will enhance your understanding.</p>
                </div>
            </div>
        `
    },
    interactive: {
        title: "Interactive Exploration - Hands-On Learning",
        content: `
            <div class="topic-content-section">
                <h3><i class="fas fa-hand-pointer"></i> Learn by Doing</h3>
                <p>The best way to understand quantum mechanics is through interactive exploration. This tool provides real-time visualization of quantum concepts.</p>
            </div>

            <div class="topic-content-section">
                <h4><i class="fas fa-sliders-h"></i> Interactive Features</h4>
                <ul>
                    <li><strong>State Manipulation:</strong> Use sliders to create custom quantum states</li>
                    <li><strong>Gate Applications:</strong> Apply quantum gates and see instant results</li>
                    <li><strong>3D Visualization:</strong> Watch state evolution on the Bloch sphere</li>
                    <li><strong>Real-time Updates:</strong> See probabilities and phases change live</li>
                    <li><strong>Common States:</strong> Explore predefined quantum states</li>
                </ul>
            </div>

            <div class="topic-content-section">
                <h4><i class="fas fa-experiment"></i> Exploration Activities</h4>
                <ul>
                    <li>Create superposition states and observe measurement probabilities</li>
                    <li>Apply different quantum gates and track state evolution</li>
                    <li>Explore the relationship between Bloch sphere coordinates and state amplitudes</li>
                    <li>Experiment with phase relationships between |0⟩ and |1⟩ components</li>
                    <li>Visualize how quantum gates correspond to rotations on the Bloch sphere</li>
                </ul>
            </div>

            <div class="topic-content-section">
                <h4><i class="fas fa-chart-line"></i> Visual Learning Benefits</h4>
                <div class="topic-highlight">
                    <p>Interactive visualization helps build intuition for abstract quantum concepts that are difficult to grasp through equations alone.</p>
                </div>
            </div>
        `
    },
    practice: {
        title: "Practice Exercises - Strengthen Your Skills",
        content: `
            <div class="topic-content-section">
                <h3><i class="fas fa-dumbbell"></i> Skill Building Exercises</h3>
                <p>Reinforce your understanding through targeted practice exercises that challenge different aspects of quantum mechanics.</p>
            </div>

            <div class="topic-content-section">
                <h4><i class="fas fa-tasks"></i> Exercise Categories</h4>
                <ul>
                    <li><strong>State Preparation:</strong> Create specific quantum states from parameters</li>
                    <li><strong>Gate Sequences:</strong> Apply multiple gates to achieve target states</li>
                    <li><strong>Measurement Prediction:</strong> Calculate probabilities before measurement</li>
                    <li><strong>Phase Manipulation:</strong> Work with complex phases and relative phases</li>
                    <li><strong>Geometric Intuition:</strong> Predict Bloch sphere coordinates</li>
                </ul>
            </div>

            <div class="topic-content-section">
                <h4><i class="fas fa-graduation-cap"></i> Progressive Difficulty</h4>
                <ul>
                    <li><strong>Beginner:</strong> Single qubit states and basic gates</li>
                    <li><strong>Intermediate:</strong> Complex superpositions and gate combinations</li>
                    <li><strong>Advanced:</strong> Optimization problems and circuit analysis</li>
                    <li><strong>Expert:</strong> Protocol design and error analysis</li>
                </ul>
            </div>

            <div class="topic-content-section">
                <h4><i class="fas fa-trophy"></i> Skill Assessment</h4>
                <div class="topic-highlight">
                    <p>Track your progress and identify areas for improvement through systematic practice and self-assessment.</p>
                </div>
            </div>
        `
    },
    advanced: {
        title: "Advanced Topics - Quantum Computing Frontiers",
        content: `
            <div class="topic-content-section">
                <h3><i class="fas fa-rocket"></i> Beyond Single Qubits</h3>
                <p>Explore advanced quantum computing concepts that form the foundation of real quantum algorithms and applications.</p>
            </div>

            <div class="topic-content-section">
                <h4><i class="fas fa-network-wired"></i> Multi-Qubit Systems</h4>
                <ul>
                    <li><strong>Tensor Products:</strong> Mathematical framework for multi-qubit states</li>
                    <li><strong>Entanglement:</strong> Non-classical correlations between qubits</li>
                    <li><strong>Bell States:</strong> Maximally entangled two-qubit states</li>
                    <li><strong>GHZ States:</strong> Multi-qubit entangled states</li>
                    <li><strong>Schmidt Decomposition:</strong> Analyzing entanglement structure</li>
                </ul>
            </div>

            <div class="topic-content-section">
                <h4><i class="fas fa-algorithm"></i> Quantum Algorithms</h4>
                <ul>
                    <li><strong>Deutsch-Jozsa:</strong> First quantum speedup demonstration</li>
                    <li><strong>Grover's Algorithm:</strong> Quantum search with quadratic speedup</li>
                    <li><strong>Shor's Algorithm:</strong> Exponential speedup for factoring</li>
                    <li><strong>Quantum Fourier Transform:</strong> Core subroutine for many algorithms</li>
                    <li><strong>Variational Algorithms:</strong> NISQ-era quantum computing</li>
                </ul>
            </div>

            <div class="topic-content-section">
                <h4><i class="fas fa-shield-alt"></i> Quantum Error Correction</h4>
                <div class="topic-highlight">
                    <p>Essential for building fault-tolerant quantum computers that can run long algorithms reliably.</p>
                </div>
                <ul>
                    <li><strong>Quantum Error Models:</strong> Bit flip, phase flip, and depolarizing noise</li>
                    <li><strong>Stabilizer Codes:</strong> Framework for quantum error correction</li>
                    <li><strong>Surface Codes:</strong> Leading approach for fault-tolerant computing</li>
                    <li><strong>Logical Qubits:</strong> Protected quantum information</li>
                </ul>
            </div>
        `
    }
};

function openTopicModal(topicId) {
    const modal = document.getElementById('topicModal');
    const title = document.getElementById('topicModalTitle');
    const content = document.getElementById('topicModalContent');
    
    const data = topicData[topicId] || learningData[topicId];
    if (!data) return;
    
    title.textContent = data.title;
    content.innerHTML = data.content;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openLearningModal(learningId) {
    openTopicModal(learningId);
}

function closeTopicModal() {
    const modal = document.getElementById('topicModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Keyboard support for topic modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeTopicModal();
    }
});

// Click outside to close topic modal
document.getElementById('topicModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeTopicModal();
    }
});
