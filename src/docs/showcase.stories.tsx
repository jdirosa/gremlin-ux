import type { Meta, StoryObj } from "@storybook/react";
import { css } from "@styled-system/css";
import { Button, IconButton } from "../components/button";
import { TextInput } from "../components/text-input";
import { FormField } from "../components/form-field";

// ── Inline SVG Icons ───────────────────────────────────────────────

function MailIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

// ── Layout utility styles ──────────────────────────────────────────

const pageStyles = css({
  maxWidth: "960px",
  mx: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "12",
});

const sectionStyles = css({
  display: "flex",
  flexDirection: "column",
  gap: "6",
});

const sectionTitleStyles = css({
  color: "fg",
  fontSize: "2xl",
  borderBottomWidth: "thick",
  borderBottomStyle: "solid",
  borderBottomColor: "border",
  pb: "2",
});

const subsectionTitleStyles = css({
  color: "fg.muted",
  fontSize: "md",
  fontWeight: "semibold",
  fontFamily: "body",
  letterSpacing: "0.02em",
  textTransform: "uppercase" as const,
});

const rowStyles = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "4",
  alignItems: "center",
});

const cardStyles = css({
  bg: "bg.surface",
  borderWidth: "medium",
  borderStyle: "solid",
  borderColor: "border",
  borderRadius: "lg",
  p: "6",
  display: "flex",
  flexDirection: "column",
  gap: "5",
});

const dividerStyles = css({
  borderTopWidth: "thin",
  borderTopStyle: "solid",
  borderTopColor: "border",
  my: "2",
});

// ── Color Swatch Component ─────────────────────────────────────────

const swatchGridStyles = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
  gap: "3",
});

const swatchStyles = css({
  borderRadius: "md",
  borderWidth: "medium",
  borderStyle: "solid",
  borderColor: "border",
  overflow: "hidden",
});

const swatchColorStyles = css({
  height: "12",
});

const swatchLabelStyles = css({
  bg: "bg.surface",
  px: "2",
  py: "1",
  fontSize: "xs",
  fontFamily: "mono",
  color: "fg.muted",
  textAlign: "center",
});

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <div className={swatchStyles}>
      <div className={swatchColorStyles} style={{ backgroundColor: color }} />
      <div className={swatchLabelStyles}>{label}</div>
    </div>
  );
}

// ── Semantic Color Swatch (uses CSS custom properties) ─────────────

const semanticSwatchColorMap: Array<{ token: string; label: string }> = [
  { token: "colors.accent", label: "accent" },
  { token: "colors.accent.hover", label: "accent.hover" },
  { token: "colors.accent.subtle", label: "accent.subtle" },
  { token: "colors.status.error", label: "status.error" },
  { token: "colors.status.warning", label: "status.warning" },
  { token: "colors.status.success", label: "status.success" },
  { token: "colors.status.info", label: "status.info" },
  { token: "colors.fg", label: "fg" },
  { token: "colors.fg.muted", label: "fg.muted" },
  { token: "colors.fg.subtle", label: "fg.subtle" },
  { token: "colors.bg.canvas", label: "bg.canvas" },
  { token: "colors.bg.surface", label: "bg.surface" },
  { token: "colors.bg.subtle", label: "bg.subtle" },
  { token: "colors.bg.muted", label: "bg.muted" },
  { token: "colors.bg.emphasis", label: "bg.emphasis" },
  { token: "colors.border", label: "border" },
  { token: "colors.border.hover", label: "border.hover" },
  { token: "colors.border.focus", label: "border.focus" },
];

function SemanticSwatch({ token, label }: { token: string; label: string }) {
  return (
    <div className={swatchStyles}>
      <div
        className={swatchColorStyles}
        style={{ backgroundColor: `var(--${token.replace(/\./g, "-")})` }}
      />
      <div className={swatchLabelStyles}>{label}</div>
    </div>
  );
}

// ── The Showcase Page ──────────────────────────────────────────────

function ShowcasePage() {
  return (
    <div className={pageStyles}>
      {/* ─── Hero ─────────────────────────────────────── */}
      <div className={css({ textAlign: "center", py: "8" })}>
        <h1 className={css({ fontSize: "3rem", lineHeight: "tight", color: "fg" })}>
          Gremlin UI
        </h1>
        <p className={css({ color: "fg.muted", fontSize: "lg", mt: "2", fontFamily: "body" })}>
          A cheerful cartoon that has been possessed. Dark rubber hose design system.
        </p>
      </div>

      {/* ─── Typography ───────────────────────────────── */}
      <section className={sectionStyles}>
        <h2 className={sectionTitleStyles}>Typography</h2>

        <div className={cardStyles}>
          <p className={subsectionTitleStyles}>Headings (Lilita One)</p>
          <div className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
            <h1 className={css({ color: "fg" })} style={{ fontSize: "2.5rem" }}>h1 — The Gremlin Awakens</h1>
            <h2 className={css({ color: "fg" })} style={{ fontSize: "2rem" }}>h2 — Ink on Film</h2>
            <h3 className={css({ color: "fg" })} style={{ fontSize: "1.5rem" }}>h3 — Rubber Hose Motion</h3>
            <h4 className={css({ color: "fg" })} style={{ fontSize: "1.25rem" }}>h4 — Cherry Red Focus Rings</h4>
            <h5 className={css({ color: "fg" })} style={{ fontSize: "1.125rem" }}>h5 — Thick Ink Borders</h5>
            <h6 className={css({ color: "fg" })} style={{ fontSize: "1rem" }}>h6 — Squash and Stretch</h6>
          </div>

          <div className={dividerStyles} />

          <p className={subsectionTitleStyles}>Body Text (DM Sans)</p>
          <p className={css({ color: "fg", fontFamily: "body", lineHeight: "relaxed" })}>
            The aesthetic is dark rubber hose -- 1920s cartoon animation pulled through a horror lens.
            Think Cuphead&#39;s hand-inked watercolors depicting nightmares. The colors are bright.
            The borders are thick like ink strokes. The motion is squash-and-stretch, but the timing
            is a beat off -- things settle too slowly, overshoot too far, feel <em>inhabited</em>.
          </p>
          <p className={css({ color: "fg.muted", fontFamily: "body", fontSize: "sm" })}>
            Muted secondary text -- helper descriptions, captions, and supplementary information
            rendered in the muted foreground color with smaller font size.
          </p>
          <p className={css({ color: "fg.subtle", fontFamily: "body", fontSize: "xs" })}>
            Subtle tertiary text -- timestamps, footnotes, and other de-emphasized content.
          </p>

          <div className={dividerStyles} />

          <p className={subsectionTitleStyles}>Monospace (DM Mono)</p>
          <code className={css({
            fontFamily: "mono",
            color: "fg",
            bg: "bg.subtle",
            px: "2",
            py: "1",
            borderRadius: "sm",
            fontSize: "sm",
            display: "inline-block",
          })}>
            const gremlin = createDesignSystem(&#123; theme: &quot;dark&quot; &#125;);
          </code>
        </div>
      </section>

      {/* ─── Button Gallery ───────────────────────────── */}
      <section className={sectionStyles}>
        <h2 className={sectionTitleStyles}>Button Gallery</h2>

        <div className={cardStyles}>
          <p className={subsectionTitleStyles}>Variants x Sizes</p>
          <div className={css({ display: "flex", flexDirection: "column", gap: "4" })}>
            {(["solid", "outline", "ghost"] as const).map((variant) => (
              <div key={variant} className={css({ display: "flex", gap: "4", alignItems: "center" })}>
                <span className={css({ width: "60px", color: "fg.muted", fontSize: "sm", fontFamily: "mono" })}>
                  {variant}
                </span>
                <Button variant={variant} size="sm">Small</Button>
                <Button variant={variant} size="md">Medium</Button>
                <Button variant={variant} size="lg">Large</Button>
              </div>
            ))}
          </div>

          <div className={dividerStyles} />

          <p className={subsectionTitleStyles}>With Icons</p>
          <div className={rowStyles}>
            <Button leftIcon={<MailIcon />}>Send Email</Button>
            <Button rightIcon={<ArrowRightIcon />}>Next Step</Button>
            <Button leftIcon={<HeartIcon />} rightIcon={<ArrowRightIcon />}>Favorite</Button>
            <Button variant="outline" leftIcon={<SearchIcon />}>Search</Button>
            <Button variant="ghost" leftIcon={<GlobeIcon />}>Website</Button>
          </div>

          <div className={dividerStyles} />

          <p className={subsectionTitleStyles}>Icon Buttons</p>
          <div className={rowStyles}>
            <IconButton aria-label="Close" variant="ghost" size="sm"><XIcon /></IconButton>
            <IconButton aria-label="Close" variant="ghost" size="md"><XIcon /></IconButton>
            <IconButton aria-label="Favorite" variant="outline" size="md"><HeartIcon /></IconButton>
            <IconButton aria-label="Send" variant="solid" size="md"><MailIcon /></IconButton>
            <IconButton aria-label="Search" variant="solid" size="lg"><SearchIcon /></IconButton>
          </div>

          <div className={dividerStyles} />

          <p className={subsectionTitleStyles}>States</p>
          <div className={rowStyles}>
            <Button loading>Submitting</Button>
            <Button loading loadingText="Sending...">Send</Button>
            <Button variant="outline" loading>Loading</Button>
            <Button disabled>Disabled Solid</Button>
            <Button variant="outline" disabled>Disabled Outline</Button>
            <Button variant="ghost" disabled>Disabled Ghost</Button>
          </div>
        </div>
      </section>

      {/* ─── Form Fields ──────────────────────────────── */}
      <section className={sectionStyles}>
        <h2 className={sectionTitleStyles}>Form Fields</h2>

        <div className={cardStyles}>
          <p className={subsectionTitleStyles}>Input States</p>

          <div className={css({ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4" })}>
            <FormField label="Default Input">
              <TextInput placeholder="Type something..." />
            </FormField>

            <FormField label="Required Field" required>
              <TextInput placeholder="Can't skip this one" />
            </FormField>

            <FormField label="With Description" description="We'll never share your email with anyone.">
              <TextInput type="email" placeholder="you@example.com" />
            </FormField>

            <FormField label="Error State" error="This field is required." required>
              <TextInput placeholder="Something went wrong" />
            </FormField>

            <FormField label="With Description + Error" description="Must be at least 8 characters." error="Password is too short.">
              <TextInput type="password" placeholder="Enter password" />
            </FormField>

            <FormField label="Disabled Field" disabled>
              <TextInput placeholder="You can't edit this" />
            </FormField>
          </div>

          <div className={dividerStyles} />

          <p className={subsectionTitleStyles}>Input Elements and Addons</p>

          <div className={css({ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4" })}>
            <FormField label="Search with Icon">
              <TextInput leftElement={<SearchIcon />} placeholder="Search..." />
            </FormField>

            <FormField label="User with Icon">
              <TextInput leftElement={<UserIcon />} placeholder="Username" />
            </FormField>

            <FormField label="URL with Addons">
              <TextInput leftAddon="https://" rightAddon=".com" placeholder="example" />
            </FormField>

            <FormField label="Price with Addon">
              <TextInput leftAddon="$" rightAddon="USD" placeholder="0.00" />
            </FormField>
          </div>
        </div>
      </section>

      {/* ─── Realistic Mini-Form ──────────────────────── */}
      <section className={sectionStyles}>
        <h2 className={sectionTitleStyles}>Contact Form</h2>

        <div className={cardStyles} style={{ maxWidth: "480px" }}>
          <p className={css({ color: "fg.muted", fontFamily: "body", fontSize: "sm" })}>
            A realistic form composition using FormField, TextInput, and Button together.
          </p>

          <FormField label="Full Name" required>
            <TextInput leftElement={<UserIcon />} placeholder="James DiRosa" />
          </FormField>

          <FormField label="Email Address" required description="We'll send a confirmation to this address.">
            <TextInput type="email" leftElement={<MailIcon />} placeholder="james@example.com" />
          </FormField>

          <FormField label="Website" description="Optional -- your portfolio or personal site.">
            <TextInput leftAddon="https://" placeholder="gremlin-ui.dev" />
          </FormField>

          <FormField label="Password" required description="Must be at least 8 characters.">
            <TextInput type="password" leftElement={<LockIcon />} placeholder="Something secure" />
          </FormField>

          <FormField
            label="Confirm Password"
            required
            error="Passwords do not match."
          >
            <TextInput type="password" leftElement={<LockIcon />} placeholder="Type it again" />
          </FormField>

          <div className={css({ display: "flex", gap: "3", justifyContent: "flex-end", pt: "2" })}>
            <Button variant="ghost">Cancel</Button>
            <Button variant="solid" rightIcon={<ArrowRightIcon />}>Create Account</Button>
          </div>
        </div>
      </section>

      {/* ─── Color / Token Swatches ───────────────────── */}
      <section className={sectionStyles}>
        <h2 className={sectionTitleStyles}>Color Palette</h2>

        <div className={cardStyles}>
          <p className={subsectionTitleStyles}>The Cheerful Cast (Primitives)</p>
          <div className={swatchGridStyles}>
            <Swatch color="#FF4D6A" label="red" />
            <Swatch color="#FF85B3" label="pink" />
            <Swatch color="#FFD93D" label="yellow" />
            <Swatch color="#FFA63D" label="orange" />
            <Swatch color="#4AEAAB" label="green" />
            <Swatch color="#4DE8E0" label="cyan" />
            <Swatch color="#B47EFF" label="violet" />
          </div>

          <div className={dividerStyles} />

          <p className={subsectionTitleStyles}>Deep Variants (Light Modes)</p>
          <div className={swatchGridStyles}>
            <Swatch color="#D93A56" label="redDeep" />
            <Swatch color="#C43068" label="pinkDeep" />
            <Swatch color="#9E7C00" label="goldDark" />
            <Swatch color="#1A7A54" label="greenDeep" />
            <Swatch color="#1A7A74" label="tealDeep" />
          </div>

          <div className={dividerStyles} />

          <p className={subsectionTitleStyles}>Semantic Tokens (Theme-Aware)</p>
          <p className={css({ color: "fg.muted", fontFamily: "body", fontSize: "sm" })}>
            These swatches resolve to different values per theme. Switch themes in the toolbar to see them change.
          </p>
          <div className={swatchGridStyles}>
            {semanticSwatchColorMap.map(({ token, label }) => (
              <SemanticSwatch key={token} token={token} label={label} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Border & Radius ──────────────────────────── */}
      <section className={sectionStyles}>
        <h2 className={sectionTitleStyles}>Borders &amp; Radii</h2>

        <div className={cardStyles}>
          <p className={subsectionTitleStyles}>Border Weights</p>
          <div className={rowStyles}>
            {([
              { width: "1.5px", label: "thin (1.5px)" },
              { width: "2px", label: "medium (2px)" },
              { width: "3px", label: "thick (3px)" },
            ] as const).map(({ width, label }) => (
              <div
                key={label}
                className={css({
                  bg: "bg.subtle",
                  color: "fg.muted",
                  px: "4",
                  py: "3",
                  borderRadius: "md",
                  borderStyle: "solid",
                  borderColor: "border",
                  fontFamily: "mono",
                  fontSize: "xs",
                })}
                style={{ borderWidth: width }}
              >
                {label}
              </div>
            ))}
          </div>

          <div className={dividerStyles} />

          <p className={subsectionTitleStyles}>Border Radii</p>
          <div className={rowStyles}>
            {([
              { radius: "8px", label: "sm (8px)" },
              { radius: "12px", label: "md (12px)" },
              { radius: "16px", label: "lg (16px)" },
              { radius: "24px", label: "xl (24px)" },
              { radius: "9999px", label: "full" },
            ] as const).map(({ radius, label }) => (
              <div
                key={label}
                className={css({
                  bg: "bg.subtle",
                  color: "fg.muted",
                  borderWidth: "medium",
                  borderStyle: "solid",
                  borderColor: "border",
                  fontFamily: "mono",
                  fontSize: "xs",
                  width: "12",
                  height: "12",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                })}
                style={{ borderRadius: radius }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Spacing Scale ────────────────────────────── */}
      <section className={sectionStyles}>
        <h2 className={sectionTitleStyles}>Spacing Scale</h2>

        <div className={cardStyles}>
          <div className={css({ display: "flex", flexDirection: "column", gap: "2" })}>
            {([
              { size: "4px", label: "1 (4px)" },
              { size: "8px", label: "2 (8px)" },
              { size: "12px", label: "3 (12px)" },
              { size: "16px", label: "4 (16px)" },
              { size: "24px", label: "6 (24px)" },
              { size: "32px", label: "8 (32px)" },
              { size: "48px", label: "12 (48px)" },
            ] as const).map(({ size, label }) => (
              <div key={label} className={css({ display: "flex", alignItems: "center", gap: "3" })}>
                <span className={css({ width: "80px", fontFamily: "mono", fontSize: "xs", color: "fg.muted", textAlign: "right" })}>
                  {label}
                </span>
                <div
                  className={css({ borderRadius: "sm" })}
                  style={{
                    width: size,
                    height: "12px",
                    backgroundColor: "var(--colors-accent)",
                    opacity: 0.7,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────── */}
      <div className={css({ textAlign: "center", py: "8", color: "fg.subtle", fontSize: "sm", fontFamily: "body" })}>
        Gremlin UI Design System -- named after a gremlin, not a cute mascot.
      </div>
    </div>
  );
}

// ── Storybook Meta ─────────────────────────────────────────────────

const meta = {
  title: "Showcase/All Components",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Showcase: Story = {
  render: () => <ShowcasePage />,
};
