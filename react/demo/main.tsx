import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import {
  ThemeProvider, useBuzzTheme,
  Button, Card, Tag, Chip, Badge, Input, Nav, NavItem, Hr,
  Kicker, Display, GhostNum, GhostWord,
  Segmented, Switch, Checkbox, Radio, Select,
  Progress, Tooltip, Modal, ToastProvider, useToast,
  Table, Stat, Ticker, Frame, Accordion,
} from '@buzz-ink/react';

function ControlBar() {
  const t = useBuzzTheme();
  return (
    <div className="bar">
      <div className="wrap">
        <div className="brand">BUZZ <b>&amp;</b> INK <span style={{ color: 'var(--bi-text-3)' }}>react</span></div>
        <div className="ctl"><label>Theme</label>
          <Segmented id="ctl-theme" options={['light', 'dark']} value={t.theme}
            onChange={(v) => t.set({ theme: v as typeof t.theme })} />
        </div>
        <div className="ctl"><label>Edges</label>
          <Segmented id="ctl-radius" options={['sharp', 'standard', 'soft']} value={t.radius}
            onChange={(v) => t.set({ radius: v as typeof t.radius })} />
        </div>
        <div className="ctl"><label>Contrast</label>
          <Segmented id="ctl-contrast" options={['standard', 'deep']} value={t.contrast}
            onChange={(v) => t.set({ contrast: v as typeof t.contrast })} />
        </div>
        <div className="ctl"><label>Accent</label>
          <Segmented id="ctl-accent" options={['buzz', 'amber', 'rust']} value={t.accent}
            onChange={(v) => t.set({ accent: v as typeof t.accent })} />
        </div>
        <div className="ctl"><label>Ink</label>
          <Segmented id="ctl-neutral" options={['warm', 'carbon', 'espresso']} value={t.neutral}
            onChange={(v) => t.set({ neutral: v as typeof t.neutral })} />
        </div>
        <div className="ctl"><label>Paper</label>
          <Segmented id="ctl-paper" options={['cream', 'ivory', 'oat']} value={t.paper}
            onChange={(v) => t.set({ paper: v as typeof t.paper })} />
        </div>
        <div className="ctl"><label>Type</label>
          <Segmented id="ctl-type" options={['fraunces', 'bricolage']} value={t.type}
            onChange={(v) => t.set({ type: v as typeof t.type })} />
        </div>
      </div>
    </div>
  );
}

function SectionHead({ num, title }: { num: string; title: string }) {
  return (
    <div className="sec-head">
      <GhostNum style={{ fontSize: 44 }}>{num}</GhostNum>
      <Display as="h2" style={{ fontSize: 28 }}>{title}</Display>
    </div>
  );
}

function Gallery() {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [seg, setSeg] = useState('Day');
  const [progress, setProgress] = useState(68);

  return (
    <div className="wrap">
      <section>
        <Kicker>An editorial design system — now in React</Kicker>
        <Display style={{ fontSize: 'var(--bi-text-hero)', margin: '16px 0 14px' }}>
          Same ink. <em>New wrappers.</em>
        </Display>
        <p style={{ color: 'var(--bi-text-2)', maxWidth: '56ch', lineHeight: 1.6 }}>
          Every component below is a typed React component from @buzz-ink/react.
          The six controls above run through <code>useBuzzTheme()</code> — the
          provider writes the attributes, the CSS does the rest.
        </p>
        <div className="row" style={{ marginTop: 24 }}>
          <Button id="btn-primary" onClick={() => toast('Primary clicked.')}>Primary action</Button>
          <Button variant="ghost">Ghost action</Button>
          <Button variant="ghost" href="https://www.lainow.com" target="_blank" rel="noreferrer">Link button</Button>
          <Chip>Accepting new clients</Chip>
        </div>
      </section>

      <section>
        <SectionHead num="01" title="Core" />
        <div className="row">
          <Tag>FastAPI</Tag><Tag>RAG</Tag><Tag>Three.js</Tag><Tag>MCP</Tag>
          <Badge>Flagship</Badge>
          <Badge variant="live">Live</Badge>
          <Badge variant="ink">Archived</Badge>
        </div>
        <div className="grid" style={{ marginBottom: 18 }}>
          <Card interactive num="01 — WORK" heading="Interactive card" id="card-interactive">
            Hover me — the raise shadow follows the current edge personality.
          </Card>
          <Card num="02 — STATIC" heading="Quiet card">
            Surface, hairline border, serif heading, muted body.
          </Card>
          <Card num="03 — FORM" heading="Input">
            <Input placeholder="Ask Digby about Chris…" />
          </Card>
        </div>
        <Nav>
          <NavItem href="#" active>Home</NavItem>
          <NavItem href="#">Work</NavItem>
          <NavItem href="#">The Hive</NavItem>
          <NavItem href="#">About</NavItem>
        </Nav>
        <Hr label="Labeled rule" style={{ marginTop: 22 }} />
      </section>

      <section>
        <SectionHead num="02" title="Forms" />
        <div className="row">
          <Segmented id="demo-seg" options={['Day', 'Week', 'Month']} value={seg} onChange={setSeg} />
          <Switch id="demo-switch" defaultChecked label="Digby enabled" />
          <Checkbox defaultChecked label="Email me updates" />
          <Radio name="mode" defaultChecked label="Virtual" />
          <Radio name="mode" label="In person" />
          <Select defaultValue="consulting">
            <option value="consulting">Consulting session</option>
            <option value="review">Project review</option>
            <option value="workshop">Workshop</option>
          </Select>
        </div>
      </section>

      <section>
        <SectionHead num="03" title="Feedback" />
        <div className="row">
          <Tooltip tip="Tooltips are pure CSS">
            <Button variant="ghost">Hover for tooltip</Button>
          </Tooltip>
          <Button id="toast-ok" onClick={() => toast('Deployed — lainow.com is live.', { kind: 'ok' })}>
            Toast (ok)
          </Button>
          <Button id="toast-warn" variant="ghost" onClick={() => toast('Heads up: draft not saved.', { kind: 'warn' })}>
            Toast (warn)
          </Button>
          <Button id="modal-open" variant="ghost" onClick={() => setModalOpen(true)}>Open modal</Button>
        </div>
        <div style={{ maxWidth: 420, marginTop: 6 }} className="row">
          <div style={{ flex: 1 }}>
            <Progress id="demo-progress" value={progress} />
          </div>
          <Button variant="ghost" id="progress-bump" onClick={() => setProgress((p) => (p >= 100 ? 8 : p + 16))}>
            +16%
          </Button>
        </div>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          heading="Book a session."
          dismissOnBackdrop
        >
          <p>
            Modals ride the native dialog element — focus trapping and Escape
            handling come free from the platform.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button id="modal-confirm" onClick={() => { setModalOpen(false); toast('Booked.', { kind: 'ok' }); }}>Confirm</Button>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </Modal>
      </section>

      <section>
        <SectionHead num="04" title="Data" />
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', marginBottom: 22 }}>
          <Stat value="3.9" label="GPA / 4.0" />
          <Stat value="50+" label="Club athletes led" />
          <Stat value="8" label="Shipped builds" />
          <Stat value="45" label="Hive nodes" />
        </div>
        <Table
          head={['Project', 'Stack', 'Status']}
          rows={[
            ['LearnAI', 'React · FastAPI · Supabase', <Badge variant="live">Live</Badge>],
            ['Digby', 'Tauri · MCP · Ollama', <Badge>Flagship</Badge>],
            ['Planno', 'React · FastAPI', <Badge variant="live">Live</Badge>],
          ]}
        />
      </section>

      <section>
        <SectionHead num="05" title="Editorial" />
        <Ticker
          items={['Warm cream', 'Working orange', 'Rich ink', 'One graph']}
          style={{ marginBottom: 26 }}
        />
        <div className="row" style={{ alignItems: 'flex-end', gap: 40 }}>
          <GhostWord>BUZZ</GhostWord>
          <Frame caption="Lake Grove, NY">
            <div
              className="bi-frame-media"
              style={{
                width: 190, height: 150,
                background: 'radial-gradient(circle at 30% 30%,var(--bi-buzz-200),var(--bi-buzz-500))',
              }}
            />
          </Frame>
          <div style={{ flex: 1, minWidth: 220 }}>
            <Accordion heading="What is @buzz-ink/react?">
              Typed React wrappers over the buzz-and-ink CSS — the styling stays in the design system.
            </Accordion>
            <Accordion heading="Does it need JavaScript for accordions?">
              Still no — this is the native details element with a React coat.
            </Accordion>
          </div>
        </div>
      </section>

      <footer>BUZZ &amp; INK — @buzz-ink/react DEMO — MIT</footer>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <ToastProvider>
      <ControlBar />
      <Gallery />
    </ToastProvider>
  </ThemeProvider>,
);
