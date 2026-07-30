import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import '../../src/index.css';
import '../src/voices.css';

import { Theme } from '@astryxdesign/core/theme';
import { AppShell } from '@astryxdesign/core/AppShell';
import { TopNav } from '@astryxdesign/core/TopNav';
import { SideNav, SideNavItem, SideNavSection } from '@astryxdesign/core/SideNav';
import { Avatar } from '@astryxdesign/core/Avatar';
import { Badge } from '@astryxdesign/core/Badge';
import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { Card } from '@astryxdesign/core/Card';
import { Dialog, DialogHeader } from '@astryxdesign/core/Dialog';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { ProgressBar } from '@astryxdesign/core/ProgressBar';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Selector } from '@astryxdesign/core/Selector';
import { StatusDot } from '@astryxdesign/core/StatusDot';
import { Switch } from '@astryxdesign/core/Switch';
import { Tab, TabList } from '@astryxdesign/core/TabList';
import { Table } from '@astryxdesign/core/Table';
import { TextInput } from '@astryxdesign/core/TextInput';

import { buzzInkSharp, buzzInkSoft, buzzInkTheme } from '@buzz-ink/astryx';

type Edges = 'standard' | 'sharp' | 'soft';
const THEMES = { standard: buzzInkTheme, sharp: buzzInkSharp, soft: buzzInkSoft } as const;

type Convo = Record<string, unknown> & {
  question: string;
  route: string;
  latency: string;
  grounded: 'grounded' | 'partial' | 'fallback';
};

const CONVOS: Convo[] = [
  { question: 'What is LearnAI and is it live?', route: '/work?p=learnai', latency: '1.4s', grounded: 'grounded' },
  { question: 'How does the Hive graph work?', route: '/hive', latency: '1.9s', grounded: 'grounded' },
  { question: 'Can Digby book a consulting session?', route: '/contact', latency: '2.2s', grounded: 'partial' },
  { question: 'Show me the CyberGame project', route: '/work?p=cybergame', latency: '1.6s', grounded: 'grounded' },
  { question: 'What was Chris’s GPA freshman year?', route: '—', latency: '0.9s', grounded: 'fallback' },
];

const GROUNDED_BADGE = {
  grounded: { variant: 'success' as const, label: 'Grounded' },
  partial: { variant: 'warning' as const, label: 'Partial' },
  fallback: { variant: 'neutral' as const, label: 'Scripted' },
};

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [edges, setEdges] = useState<Edges>('standard');
  const [nav, setNav] = useState('overview');
  const [tab, setTab] = useState('recent');
  const [rebuildOpen, setRebuildOpen] = useState(false);

  const [greeting, setGreeting] = useState('Hey — I’m Digby. Ask me anything about Chris.');
  const [model, setModel] = useState('gemini-flash-latest');
  const [tone, setTone] = useState('warm');
  const [cardsOn, setCardsOn] = useState(true);
  const [waveOn, setWaveOn] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-radius', edges);
  }, [edges]);

  return (
    <Theme theme={THEMES[edges]} mode={mode}>
      <AppShell
        contentPadding={4}
        topNav={
          <TopNav
            label="Digby mission control"
            heading={<span className="mc-brand">DIGBY <b>&times;</b> MISSION CONTROL</span>}
            endContent={
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <StatusDot variant="success" label="Online" />
                <SegmentedControl label="Theme mode" value={mode} onChange={(v) => setMode(v as 'light' | 'dark')}>
                  <SegmentedControlItem value="light" label="Light" />
                  <SegmentedControlItem value="dark" label="Dark" />
                </SegmentedControl>
                <SegmentedControl label="Edges" value={edges} onChange={(v) => setEdges(v as Edges)}>
                  <SegmentedControlItem value="standard" label="Std" />
                  <SegmentedControlItem value="sharp" label="Sharp" />
                  <SegmentedControlItem value="soft" label="Soft" />
                </SegmentedControl>
                <Avatar name="Chris Buzaid" size="sm" />
              </div>
            }
          />
        }
        sideNav={
          <SideNav
            header={<span className="mc-brand" style={{ padding: '4px 8px' }}>BUZZ <b>&amp;</b> INK</span>}
            footer={<span className="mc-foot" style={{ padding: '0 8px' }}>digby v2.3 &middot; hive 45 nodes</span>}
          >
            <SideNavSection title="Operations">
              <SideNavItem label="Overview" isSelected={nav === 'overview'} onClick={() => setNav('overview')} />
              <SideNavItem label="Conversations" isSelected={nav === 'convos'} onClick={() => setNav('convos')} />
              <SideNavItem label="Knowledge" isSelected={nav === 'knowledge'} onClick={() => setNav('knowledge')} />
            </SideNavSection>
            <SideNavSection title="Configure">
              <SideNavItem label="Persona" isSelected={nav === 'persona'} onClick={() => setNav('persona')} />
              <SideNavItem label="Sources" isSelected={nav === 'sources'} onClick={() => setNav('sources')} />
            </SideNavSection>
          </SideNav>
        }
      >
        <div className="mc-page">
          <div>
            <div className="bi-kicker">Operations / Overview</div>
            <h1 className="bi-display" style={{ fontSize: 'clamp(30px,3.6vw,44px)', margin: '12px 0 6px' }}>
              Morning, Chris. <em>All systems humming.</em>
            </h1>
          </div>

          <Banner
            status="info"
            title="Index rebuilt 12 minutes ago."
            description="45 hive nodes embedded. Next scheduled rebuild in 6 hours."
            endContent={<Button label="Rebuild now" variant="secondary" size="sm" onClick={() => setRebuildOpen(true)} />}
          />

          <div className="mc-statrow">
            <div className="bi-stat"><b>128</b><span>Queries today</span></div>
            <div className="bi-stat"><b>1.8s</b><span>Median answer</span></div>
            <div className="bi-stat"><b>96%</b><span>Grounding rate</span></div>
            <div className="bi-stat"><b>45</b><span>Hive nodes</span></div>
          </div>

          <div className="mc-cols">
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <TabList value={tab} onChange={setTab}>
                  <Tab value="recent" label="Recent" />
                  <Tab value="flagged" label="Flagged" />
                  <Tab value="saved" label="Saved" />
                </TabList>
                {tab === 'recent' ? (
                  <Table
                    idKey="question"
                    data={CONVOS}
                    columns={[
                      { key: 'question', header: 'Question' },
                      { key: 'route', header: 'Routed to' },
                      { key: 'latency', header: 'Latency' },
                      {
                        key: 'grounded',
                        header: 'Answer',
                        renderCell: (item) => {
                          const b = GROUNDED_BADGE[(item as Convo).grounded];
                          return <Badge variant={b.variant} label={b.label} />;
                        },
                      },
                    ]}
                  />
                ) : (
                  <EmptyState
                    title={tab === 'flagged' ? 'Nothing flagged.' : 'Nothing saved yet.'}
                    description={
                      tab === 'flagged'
                        ? 'Digby hasn’t said anything weird lately. Good bee.'
                        : 'Star a conversation to keep it here.'
                    }
                  />
                )}
              </div>
            </Card>

            <Card>
              <div className="mc-form">
                <div className="bi-kicker">Persona</div>
                <TextInput label="Greeting" value={greeting} onChange={setGreeting} />
                <Selector
                  label="Model"
                  value={model}
                  onChange={setModel}
                  options={[
                    { value: 'gemini-flash-latest', label: 'gemini-flash-latest' },
                    { value: 'gemini-pro-latest', label: 'gemini-pro-latest' },
                    { value: 'scripted', label: 'Scripted fallback only' },
                  ]}
                />
                <div>
                  <SegmentedControl label="Tone" value={tone} onChange={setTone}>
                    <SegmentedControlItem value="plain" label="Plain" />
                    <SegmentedControlItem value="warm" label="Warm" />
                    <SegmentedControlItem value="direct" label="Direct" />
                  </SegmentedControl>
                </div>
                <Switch label="GenUI cards" value={cardsOn} onChange={setCardsOn} description="Project and contact cards in answers" />
                <Switch label="Wave on load" value={waveOn} onChange={setWaveOn} />
                <div>
                  <div style={{ marginBottom: 10 }}>
                    <ProgressBar label="Embedding coverage" value={92} max={100} hasValueLabel />
                  </div>
                  <Button label="Save persona" variant="primary" width="100%" />
                </div>
              </div>
            </Card>
          </div>

          <div className="mc-foot">
            DIGBY MISSION CONTROL &mdash; ASTRYX &copy; META (MIT) &middot; BUZZ &amp; INK &copy; CHRIS BUZAID (MIT)
          </div>
        </div>
      </AppShell>

      <Dialog isOpen={rebuildOpen} onOpenChange={setRebuildOpen}>
        <DialogHeader title="Rebuild the index?" />
        <p style={{ color: 'var(--color-text-secondary)', margin: '0 0 18px', lineHeight: 1.55 }}>
          Re-embeds all 45 hive nodes. Digby answers from the old index until the
          rebuild finishes (~40 seconds).
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button label="Rebuild" variant="primary" onClick={() => setRebuildOpen(false)} />
          <Button label="Cancel" variant="ghost" onClick={() => setRebuildOpen(false)} />
        </div>
      </Dialog>
    </Theme>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
