import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import '../../src/index.css'; // Buzz & Ink CSS — tokens, voices, editorial devices
import '../src/voices.css'; // voice bridge: same data-* attributes → Astryx tokens

import { Theme } from '@astryxdesign/core/theme';
import { Button } from '@astryxdesign/core/Button';
import { Badge } from '@astryxdesign/core/Badge';
import { Banner } from '@astryxdesign/core/Banner';
import { Card } from '@astryxdesign/core/Card';
import { CheckboxInput } from '@astryxdesign/core/CheckboxInput';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { ProgressBar } from '@astryxdesign/core/ProgressBar';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { StatusDot } from '@astryxdesign/core/StatusDot';
import { Switch } from '@astryxdesign/core/Switch';
import { Tab, TabList } from '@astryxdesign/core/TabList';
import { Table } from '@astryxdesign/core/Table';
import { TextInput } from '@astryxdesign/core/TextInput';

import { buzzInkSharp, buzzInkSoft, buzzInkTheme } from '@buzz-ink/astryx';

type Edges = 'standard' | 'sharp' | 'soft';
const THEMES = { standard: buzzInkTheme, sharp: buzzInkSharp, soft: buzzInkSoft } as const;

function AttrControl({ id, attr, options, value, onChange }: {
  id: string;
  attr: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="ctl" id={id}>
      <label>{attr}</label>
      <SegmentedControl label={attr} value={value} onChange={onChange}>
        {options.map((o) => (
          <SegmentedControlItem key={o} value={o} label={o} />
        ))}
      </SegmentedControl>
    </div>
  );
}

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [edges, setEdges] = useState<Edges>('standard');
  const [accent, setAccent] = useState('buzz');
  const [neutral, setNeutral] = useState('warm');
  const [paper, setPaper] = useState('cream');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [tab, setTab] = useState('work');
  const [digby, setDigby] = useState(true);
  const [updates, setUpdates] = useState(false);
  const [ask, setAsk] = useState('');
  const [email, setEmail] = useState('');
  const [progress, setProgress] = useState(64);

  // One set of attributes drives both systems: the Buzz & Ink CSS reads them
  // directly, voices.css retargets them at Astryx's tokens.
  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute('data-radius', edges);
    el.setAttribute('data-accent', accent);
    el.setAttribute('data-neutral', neutral);
    el.setAttribute('data-paper', paper);
  }, [edges, accent, neutral, paper]);

  return (
    <Theme theme={THEMES[edges]} mode={mode}>
      <div className="bar">
        <div className="wrap">
          <div className="brand">BUZZ <b>&amp;</b> INK <span style={{ color: 'var(--bi-text-3)' }}>× ASTRYX</span></div>
          <AttrControl id="ctl-mode" attr="Theme" options={['light', 'dark']} value={mode}
            onChange={(v) => setMode(v as 'light' | 'dark')} />
          <AttrControl id="ctl-edges" attr="Edges" options={['standard', 'sharp', 'soft']} value={edges}
            onChange={(v) => setEdges(v as Edges)} />
          <AttrControl id="ctl-accent" attr="Accent" options={['buzz', 'amber', 'rust']} value={accent} onChange={setAccent} />
          <AttrControl id="ctl-neutral" attr="Ink" options={['warm', 'carbon', 'espresso']} value={neutral} onChange={setNeutral} />
          <AttrControl id="ctl-paper" attr="Paper" options={['cream', 'ivory', 'oat']} value={paper} onChange={setPaper} />
        </div>
      </div>

      <div className="wrap">
        <section>
          <div className="bi-kicker">Two systems, one ink</div>
          <h1 className="bi-display" style={{ fontSize: 'var(--bi-text-hero)', margin: '16px 0 14px' }}>
            Meta&rsquo;s bones. <em>Our blood.</em>
          </h1>
          <p style={{ color: 'var(--bi-text-2)', maxWidth: '58ch', lineHeight: 1.6 }}>
            Every widget below is a stock Astryx component wearing the Buzz &amp; Ink
            theme — cream paper, working orange, Fraunces headings. The headline,
            kicker, and ticker are Buzz &amp; Ink&rsquo;s own editorial layer. The controls
            above drive both systems through the same attributes.
          </p>
          <div className="row" style={{ marginTop: 22 }}>
            <Button label="Primary action" variant="primary" onClick={() => setDialogOpen(true)} />
            <Button label="Secondary" variant="secondary" />
            <Button label="Ghost" variant="ghost" />
            <Button label="Destructive" variant="destructive" />
          </div>
        </section>

        <div className="bi-ticker" style={{ margin: '18px 0 4px' }}>
          <div>
            <span>Warm cream</span><span>Working orange</span><span>Rich ink</span><span>160 components</span>
            <span>Warm cream</span><span>Working orange</span><span>Rich ink</span><span>160 components</span>
          </div>
        </div>

        <section>
          <div className="sec-head"><span className="bi-ghost-num">01</span>
            <h2 className="bi-display" style={{ fontSize: 26 }}>Status &amp; feedback</h2></div>
          <div className="row">
            <Badge label="Neutral" variant="neutral" />
            <Badge label="Info" variant="info" />
            <Badge label="Success" variant="success" />
            <Badge label="Warning" variant="warning" />
            <Badge label="Error" variant="error" />
            <Badge label="Orange" variant="orange" />
            <Badge label="Teal" variant="teal" />
            <StatusDot variant="success" label="Live" />
            <StatusDot variant="accent" label="Building" />
          </div>
          <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Banner status="info" title="Digby is online." description="The hive graph refreshed 4 minutes ago." />
            <Banner status="success" title="Deployed — lainow.com is live." />
            <div className="row" style={{ marginBottom: 0 }}>
              <div style={{ flex: 1 }}>
                <ProgressBar label="Portfolio polish" value={progress} max={100} />
              </div>
              <Button label="+12%" variant="ghost" size="sm" onClick={() => setProgress((p) => (p >= 100 ? 16 : p + 12))} />
            </div>
          </div>
        </section>

        <section>
          <div className="sec-head"><span className="bi-ghost-num">02</span>
            <h2 className="bi-display" style={{ fontSize: 26 }}>Forms</h2></div>
          <div className="grid" style={{ marginBottom: 16 }}>
            <TextInput label="Ask Digby" placeholder="What is the Hive?" value={ask} onChange={setAsk} />
            <TextInput label="Email" placeholder="you@example.com" description="Never shared. Ever." value={email} onChange={setEmail} />
          </div>
          <div className="row">
            <Switch label="Digby enabled" value={digby} onChange={setDigby} />
            <CheckboxInput label="Email me updates" value={updates} onChange={setUpdates} />
            <TabList value={tab} onChange={setTab}>
              <Tab value="work" label="Work" />
              <Tab value="hive" label="The Hive" />
              <Tab value="about" label="About" />
            </TabList>
          </div>
        </section>

        <section>
          <div className="sec-head"><span className="bi-ghost-num">03</span>
            <h2 className="bi-display" style={{ fontSize: 26 }}>Data</h2></div>
          <Card>
            <Table
              idKey="project"
              data={[
                { project: 'LearnAI', stack: 'React · FastAPI · Supabase', status: 'Live' },
                { project: 'Digby', stack: 'Tauri · MCP · Ollama', status: 'Flagship' },
                { project: 'Planno', stack: 'React · FastAPI', status: 'Live' },
              ]}
              columns={[
                { key: 'project', header: 'Project' },
                { key: 'stack', header: 'Stack' },
                { key: 'status', header: 'Status' },
              ]}
            />
          </Card>
        </section>

        <section>
          <div className="sec-head"><span className="bi-ghost-num">04</span>
            <h2 className="bi-display" style={{ fontSize: 26 }}>Editorial layer</h2></div>
          <div className="row" style={{ alignItems: 'flex-end', gap: 40 }}>
            <div className="bi-ghost-word">HIVE</div>
            <figure className="bi-frame" style={{ margin: 0 }}>
              <div className="bi-frame-media" style={{
                width: 190, height: 150,
                background: 'radial-gradient(circle at 30% 30%, var(--bi-buzz-200), var(--bi-buzz-500))',
              }} />
              <figcaption>Lake Grove, NY</figcaption>
            </figure>
            <p style={{ color: 'var(--bi-text-2)', maxWidth: '34ch', lineHeight: 1.6, fontSize: 14 }}>
              Ghost words, rotated frames, tickers, kickers — the devices Astryx
              doesn&rsquo;t ship. They stay pure Buzz &amp; Ink CSS, sharing tokens with
              everything above.
            </p>
          </div>
        </section>

        <footer>
          BUZZ &amp; INK × ASTRYX — DEMO<br />
          Astryx © Meta Platforms, Inc. (MIT) · Buzz &amp; Ink © Christopher Buzaid (MIT)
        </footer>
      </div>

      <Dialog isOpen={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogHeader title="Book a session." />
        <p style={{ color: 'var(--color-text-secondary)', margin: '0 0 18px', lineHeight: 1.55 }}>
          A stock Astryx dialog in Buzz &amp; Ink clothes — cream surface, ink text,
          orange focus rings.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button label="Confirm" variant="primary" onClick={() => setDialogOpen(false)} />
          <Button label="Cancel" variant="ghost" onClick={() => setDialogOpen(false)} />
        </div>
      </Dialog>
    </Theme>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
