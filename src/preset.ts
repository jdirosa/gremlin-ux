import { definePreset } from "@pandacss/dev";

export const gremlinPreset = definePreset({
  conditions: {
    extend: {
      motionReduce: "@media (prefers-reduced-motion: reduce)",
      motionSafe: "@media (prefers-reduced-motion: no-preference)",
      light: '[data-color-mode="light"] &',
      white: '[data-color-mode="white"] &',
    },
  },

  globalCss: {
    body: {
      fontFamily: "body",
    },
    "h1, h2, h3, h4, h5, h6": {
      fontFamily: "heading",
    },
  },

  theme: {
    extend: {
      // ── Primitive Tokens ──────────────────────────────────────
      tokens: {
        colors: {
          // Canvas -- The Dark World
          canvas: {
            ink: { value: "#0A0A0B" },
            charcoal: { value: "#1A1A1E" },
            surface: { value: "#242429" },
            elevated: { value: "#2E2E34" },
            highlight: { value: "#38383F" },
            // Canvas -- The Light World (parchment)
            parchment: { value: "#FBF3E0" },
            parchmentDeep: { value: "#F3EBDA" },
            parchmentMid: { value: "#EBE3D2" },
            parchmentDark: { value: "#E0D8C8" },
            parchmentDarkest: { value: "#D5CDBD" },
            // Canvas -- The White World
            white: { value: "#FFFFFF" },
            whiteDeep: { value: "#F7F7F8" },
            whiteMid: { value: "#EFEFEF" },
            whiteDark: { value: "#E4E4E7" },
            whiteDarkest: { value: "#D4D4D8" },
          },
          // Ink -- Text and Borders
          ink: {
            primary: { value: "#FFF8E7" },
            secondary: { value: "#B8B2A8" },
            tertiary: { value: "#7A756D" },
            border: { value: "#4A4550" },
            borderBold: { value: "#6B6575" },
            // Ink -- Light mode text and borders
            dark: { value: "#1A1610" },
            darkMuted: { value: "#5C5649" },
            darkSubtle: { value: "#6B6155" },
            lightBorder: { value: "#6B6155" },
            lightBorderBold: { value: "#5C5649" },
            // Ink -- White mode text and borders
            black: { value: "#18181B" },
            blackMuted: { value: "#52525B" },
            blackSubtle: { value: "#71717A" },
            whiteBorder: { value: "#6E6E78" },
            whiteBorderBold: { value: "#52525B" },
          },
          // Color -- The Cheerful Cast
          color: {
            red: { value: "#FF4D6A" },
            yellow: { value: "#FFD93D" },
            green: { value: "#4AEAAB" },
            pink: { value: "#FF85B3" },
            violet: { value: "#B47EFF" },
            cyan: { value: "#4DE8E0" },
            orange: { value: "#FFA63D" },
            // Color -- Light mode deeper variants
            redDeep: { value: "#D93A56" },
            pinkDeep: { value: "#C43068" },
            goldDark: { value: "#9E7C00" },
            greenDeep: { value: "#1A7A54" },
            tealDeep: { value: "#1A7A74" },
          },
        },
        spacing: {
          0: { value: "0" },
          0.5: { value: "2px" },
          1: { value: "4px" },
          2: { value: "8px" },
          3: { value: "12px" },
          4: { value: "16px" },
          5: { value: "20px" },
          6: { value: "24px" },
          8: { value: "32px" },
          10: { value: "40px" },
          12: { value: "48px" },
        },
        sizes: {
          container: {
            sm: { value: "640px" },
            md: { value: "768px" },
            lg: { value: "1024px" },
            xl: { value: "1280px" },
          },
          prose: { value: "640px" },
          proseNarrow: { value: "560px" },
        },
        radii: {
          sm: { value: "8px" },
          md: { value: "12px" },
          lg: { value: "16px" },
          xl: { value: "24px" },
          full: { value: "9999px" },
        },
        borderWidths: {
          thin: { value: "1.5px" },
          medium: { value: "2px" },
          thick: { value: "3px" },
        },
        fonts: {
          heading: { value: "'Lilita One', cursive" },
          body: { value: "'DM Sans', sans-serif" },
          mono: { value: "'DM Mono', monospace" },
        },
        fontSizes: {
          xs: { value: "0.75rem" },
          sm: { value: "0.875rem" },
          md: { value: "1rem" },
          lg: { value: "1.125rem" },
          xl: { value: "1.25rem" },
          "2xl": { value: "1.5rem" },
          display: { value: "clamp(2.5rem, 5vw, 5rem)" },
          section: { value: "2.5rem" },
          sectionSm: { value: "2rem" },
        },
        fontWeights: {
          normal: { value: "400" },
          medium: { value: "500" },
          semibold: { value: "600" },
          bold: { value: "700" },
        },
        lineHeights: {
          tight: { value: "1.25" },
          normal: { value: "1.5" },
          relaxed: { value: "1.625" },
        },
        durations: {
          instant: { value: "100ms" },
          fast: { value: "150ms" },
          normal: { value: "250ms" },
          slow: { value: "400ms" },
          dramatic: { value: "600ms" },
        },
        easings: {
          default: { value: "cubic-bezier(0.4, 0, 0.2, 1)" },
          in: { value: "cubic-bezier(0.4, 0, 1, 1)" },
          out: { value: "cubic-bezier(0, 0, 0.2, 1)" },
          inOut: { value: "cubic-bezier(0.4, 0, 0.2, 1)" },
          rubber: { value: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
          rubberHeavy: { value: "cubic-bezier(0.22, 1.80, 0.50, 1)" },
          reluctant: { value: "cubic-bezier(0.68, -0.20, 0.27, 1.20)" },
        },
        rotations: {
          sm: { value: "1.2deg" },
          md: { value: "1.5deg" },
          lg: { value: "1.8deg" },
          xl: { value: "2deg" },
        },
        animations: {
          fadeIn: { value: "fadeIn {durations.normal} {easings.out}" },
          fadeOut: { value: "fadeOut {durations.fast} {easings.in}" },
          scaleIn: { value: "scaleIn {durations.slow} {easings.rubberHeavy}" },
          scaleOut: { value: "scaleOut {durations.fast} {easings.in}" },
          slideDown: { value: "slideDown {durations.normal} {easings.rubber}" },
          slideUp: { value: "slideUp {durations.slow} {easings.rubber}" },
          slideDownExit: { value: "slideDownExit {durations.fast} {easings.in}" },
          pulse: { value: "pulse 1.5s {easings.inOut} infinite" },
          shake: { value: "shake {durations.normal} {easings.default}" },
          spin: { value: "spin 0.8s linear infinite" },
          squash: { value: "squash {durations.instant} {easings.out}" },
          stretch: { value: "stretch {durations.fast} {easings.rubber}" },
          mouthOpen: { value: "mouthOpen {durations.normal} {easings.rubber}" },
          asteriskPop: { value: "asteriskPop {durations.normal} {easings.rubber}" },
          errorReveal: { value: "errorReveal {durations.normal} {easings.rubber} forwards" },
          grainShift: { value: "grainShift 0.5s steps(8) infinite" },
          entranceFadeUp: { value: "entranceFadeUp {durations.dramatic} {easings.rubber} both" },
          entranceFadeDown: { value: "entranceFadeDown {durations.dramatic} {easings.rubber} both" },
          entranceFadeLeft: { value: "entranceFadeLeft {durations.dramatic} {easings.rubber} both" },
          entranceFadeRight: { value: "entranceFadeRight {durations.dramatic} {easings.rubber} both" },
          entranceScale: { value: "entranceScale {durations.slow} {easings.rubber} both" },
        },
      },

      // ── Semantic Tokens ───────────────────────────────────────
      semanticTokens: {
        colors: {
          bg: {
            overlay: {
              value: { base: "rgba(10, 10, 11, 0.70)", _light: "rgba(26, 22, 16, 0.50)", _white: "rgba(0, 0, 0, 0.40)" },
            },
            canvas: {
              value: { base: "{colors.canvas.ink}", _light: "{colors.canvas.parchment}", _white: "{colors.canvas.white}" },
            },
            surface: {
              value: { base: "{colors.canvas.charcoal}", _light: "{colors.canvas.parchmentDeep}", _white: "{colors.canvas.whiteDeep}" },
            },
            subtle: {
              value: { base: "{colors.canvas.surface}", _light: "{colors.canvas.parchmentMid}", _white: "{colors.canvas.whiteMid}" },
            },
            muted: {
              value: { base: "{colors.canvas.elevated}", _light: "{colors.canvas.parchmentDark}", _white: "{colors.canvas.whiteDark}" },
            },
            emphasis: {
              value: { base: "{colors.canvas.highlight}", _light: "{colors.canvas.parchmentDarkest}", _white: "{colors.canvas.whiteDarkest}" },
            },
          },
          fg: {
            DEFAULT: {
              value: { base: "{colors.ink.primary}", _light: "{colors.ink.dark}", _white: "{colors.ink.black}" },
            },
            muted: {
              value: { base: "{colors.ink.secondary}", _light: "{colors.ink.darkMuted}", _white: "{colors.ink.blackMuted}" },
            },
            subtle: {
              value: { base: "{colors.ink.tertiary}", _light: "{colors.ink.darkSubtle}", _white: "{colors.ink.blackSubtle}" },
            },
            onEmphasis: {
              value: { base: "{colors.ink.primary}", _light: "{colors.ink.primary}", _white: "{colors.ink.primary}" },
            },
          },
          border: {
            DEFAULT: {
              value: { base: "{colors.ink.border}", _light: "{colors.ink.lightBorder}", _white: "{colors.ink.whiteBorder}" },
            },
            hover: {
              value: { base: "{colors.ink.borderBold}", _light: "{colors.ink.lightBorderBold}", _white: "{colors.ink.whiteBorderBold}" },
            },
            focus: {
              value: { base: "{colors.color.red}", _light: "{colors.color.redDeep}", _white: "{colors.color.redDeep}" },
            },
          },
          accent: {
            DEFAULT: {
              value: { base: "{colors.color.red}", _light: "{colors.color.redDeep}", _white: "{colors.color.redDeep}" },
            },
            hover: {
              value: { base: "{colors.color.pink}", _light: "{colors.color.pinkDeep}", _white: "{colors.color.pinkDeep}" },
            },
            subtle: {
              value: { base: "rgba(255, 77, 106, 0.10)", _light: "rgba(217, 58, 86, 0.10)", _white: "rgba(217, 58, 86, 0.08)" },
            },
          },
          status: {
            error: {
              value: { base: "{colors.color.red}", _light: "{colors.color.redDeep}", _white: "{colors.color.redDeep}" },
            },
            warning: {
              value: { base: "{colors.color.yellow}", _light: "{colors.color.goldDark}", _white: "{colors.color.goldDark}" },
            },
            success: {
              value: { base: "{colors.color.green}", _light: "{colors.color.greenDeep}", _white: "{colors.color.greenDeep}" },
            },
            info: {
              value: { base: "{colors.color.cyan}", _light: "{colors.color.tealDeep}", _white: "{colors.color.tealDeep}" },
            },
          },
          overlay: {
            light: {
              value: { base: "rgba(0, 0, 0, 0.35)", _light: "rgba(0, 0, 0, 0.2)", _white: "rgba(0, 0, 0, 0.15)" },
            },
            medium: {
              value: { base: "rgba(10, 10, 11, 0.75)", _light: "rgba(10, 10, 11, 0.65)", _white: "rgba(10, 10, 11, 0.6)" },
            },
            heavy: {
              value: { base: "rgba(0, 0, 0, 0.8)", _light: "rgba(0, 0, 0, 0.6)", _white: "rgba(0, 0, 0, 0.5)" },
            },
            mist: {
              value: { base: "rgba(255, 255, 255, 0.7)", _light: "rgba(255, 255, 255, 0.5)", _white: "rgba(255, 255, 255, 0.3)" },
            },
            mistFaint: {
              value: { base: "rgba(255, 255, 255, 0.5)", _light: "rgba(255, 255, 255, 0.3)", _white: "rgba(255, 255, 255, 0.15)" },
            },
          },
          stroke: {
            value: { base: "#0A0A0B", _light: "#0A0A0B", _white: "#0A0A0B" },
          },
        },
        shadows: {
          sm: {
            value: { base: "0 1px 2px 0 rgb(0 0 0 / 0.3)", _light: "0 1px 2px 0 rgb(90 80 60 / 0.12)", _white: "0 1px 2px 0 rgb(0 0 0 / 0.08)" },
          },
          md: {
            value: { base: "0 4px 6px -1px rgb(0 0 0 / 0.4)", _light: "0 4px 6px -1px rgb(90 80 60 / 0.15)", _white: "0 4px 6px -1px rgb(0 0 0 / 0.10)" },
          },
          lg: {
            value: { base: "0 10px 15px -3px rgb(0 0 0 / 0.4)", _light: "0 10px 15px -3px rgb(90 80 60 / 0.18)", _white: "0 10px 15px -3px rgb(0 0 0 / 0.12)" },
          },
          inkOffset: {
            value: { base: "2px 3px 0 {colors.canvas.ink}", _light: "2px 3px 0 #6B6155", _white: "2px 3px 0 #6E6E78" },
          },
          inkOffsetHover: {
            value: "4px 6px 0 {colors.bg.canvas}",
          },
          textGlow: {
            value: "0 2px 20px rgba(0, 0, 0, 0.8)",
          },
        },
      },

      // ── Keyframes ─────────────────────────────────────────────
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeOut: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.90)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        scaleOut: {
          from: { opacity: "1", transform: "scale(1)" },
          to: { opacity: "0", transform: "scale(0.95)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        slideDownExit: {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(100%)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-4px)" },
          "40%": { transform: "translateX(4px)" },
          "60%": { transform: "translateX(-3px)" },
          "80%": { transform: "translateX(3px)" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        squash: {
          from: { transform: "scaleY(1) scaleX(1)" },
          to: { transform: "scaleY(0.92) scaleX(1.06)" },
        },
        stretch: {
          from: { transform: "scaleY(1) scaleX(1)" },
          to: { transform: "scaleY(1.02) scaleX(0.98)" },
        },
        mouthOpen: {
          from: { opacity: "0", transform: "scaleY(0.8)" },
          to: { opacity: "1", transform: "scaleY(1)" },
        },
        asteriskPop: {
          from: { opacity: "0", transform: "scale(0)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        errorReveal: {
          from: { opacity: "0", maxHeight: "0", transform: "translateY(-4px)" },
          to: { opacity: "1", maxHeight: "200px", transform: "translateY(0)" },
        },
        entranceFadeUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "none" },
        },
        entranceFadeDown: {
          from: { opacity: "0", transform: "translateY(-30px)" },
          to: { opacity: "1", transform: "none" },
        },
        entranceFadeLeft: {
          from: { opacity: "0", transform: "translateX(30px)" },
          to: { opacity: "1", transform: "none" },
        },
        entranceFadeRight: {
          from: { opacity: "0", transform: "translateX(-30px)" },
          to: { opacity: "1", transform: "none" },
        },
        entranceScale: {
          from: { opacity: "0", transform: "scale(0.92)" },
          to: { opacity: "1", transform: "none" },
        },
        rubberBounceUp: {
          "0%": { opacity: "0", transform: "translateY(50px) scaleY(0.85) scaleX(1.05)" },
          "50%": { opacity: "1", transform: "translateY(-8px) scaleY(1.04) scaleX(0.97)" },
          "75%": { transform: "translateY(3px) scaleY(0.98) scaleX(1.01)" },
          "100%": { opacity: "1", transform: "none" },
        },
        rubberBounceDown: {
          "0%": { opacity: "0", transform: "translateY(-50px) scaleY(0.85) scaleX(1.05)" },
          "50%": { opacity: "1", transform: "translateY(8px) scaleY(1.04) scaleX(0.97)" },
          "75%": { transform: "translateY(-3px) scaleY(0.98) scaleX(1.01)" },
          "100%": { opacity: "1", transform: "none" },
        },
        rubberBounceLeft: {
          "0%": { opacity: "0", transform: "translateX(50px) scaleX(0.85) scaleY(1.05)" },
          "50%": { opacity: "1", transform: "translateX(-8px) scaleX(1.04) scaleY(0.97)" },
          "75%": { transform: "translateX(3px) scaleX(0.98) scaleY(1.01)" },
          "100%": { opacity: "1", transform: "none" },
        },
        rubberBounceRight: {
          "0%": { opacity: "0", transform: "translateX(-50px) scaleX(0.85) scaleY(1.05)" },
          "50%": { opacity: "1", transform: "translateX(8px) scaleX(1.04) scaleY(0.97)" },
          "75%": { transform: "translateX(-3px) scaleX(0.98) scaleY(1.01)" },
          "100%": { opacity: "1", transform: "none" },
        },
        rubberBounceScale: {
          "0%": { opacity: "0", transform: "scale(0.7)" },
          "60%": { opacity: "1", transform: "scale(1.08)" },
          "80%": { transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "none" },
        },
        heroTitleIn: {
          "0%": { opacity: "0", transform: "scale(0.7) rotate(-3deg)" },
          "60%": { opacity: "1", transform: "scale(1.08) rotate(0.5deg)" },
          "80%": { transform: "scale(0.97) rotate(-0.3deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(-1.5deg)" },
        },
        idleWobble: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(2deg)" },
          "75%": { transform: "rotate(-2deg)" },
        },
        pupilShift: {
          "0%, 100%": { transform: "translateX(0)" },
          "30%": { transform: "translateX(1.5px)" },
          "70%": { transform: "translateX(-1.5px)" },
        },
        toastSlideInRight: {
          from: { transform: "translateX(120%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        toastSlideOutRight: {
          from: { transform: "translateX(0)", opacity: "1" },
          to: { transform: "translateX(120%)", opacity: "0" },
        },
        toastSlideInLeft: {
          from: { transform: "translateX(-120%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        toastSlideOutLeft: {
          from: { transform: "translateX(0)", opacity: "1" },
          to: { transform: "translateX(-120%)", opacity: "0" },
        },
        toastSlideInTop: {
          from: { transform: "translateY(-40px) scale(0.92)", opacity: "0" },
          to: { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        toastSlideOutTop: {
          from: { transform: "translateY(0) scale(1)", opacity: "1" },
          to: { transform: "translateY(-40px) scale(0.92)", opacity: "0" },
        },
        toastSlideInBottom: {
          from: { transform: "translateY(40px) scale(0.92)", opacity: "0" },
          to: { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        toastSlideOutBottom: {
          from: { transform: "translateY(0) scale(1)", opacity: "1" },
          to: { transform: "translateY(40px) scale(0.92)", opacity: "0" },
        },
        toastProgress: {
          from: { transform: "scaleX(1)" },
          to: { transform: "scaleX(0)" },
        },
        grainShift: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-2%, -3%)" },
          "30%": { transform: "translate(3%, 1%)" },
          "50%": { transform: "translate(-1%, 3%)" },
          "70%": { transform: "translate(2%, -2%)" },
          "90%": { transform: "translate(-3%, 1%)" },
        },
        cardWobble: {
          "0%": { transform: "translateY(0) rotate(var(--tilt)) scale(1)" },
          "40%": { transform: "translateY(-10px) rotate(calc(var(--tilt) * -0.6)) scale(1.03)" },
          "100%": { transform: "translateY(-6px) rotate(0.5deg) scale(1.02)" },
        },
      },
    },
  },
});
