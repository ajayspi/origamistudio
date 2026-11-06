import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { OrigamiCoach } from './OrigamiCoach';

describe('Origami Coach Component', () => {
  it('renders with child cheerful speech bubble and avatar', () => {
    const html = renderToString(
      <OrigamiCoach
        coachType="aoi"
        action="flip"
        metaphor="Flip like a pancake! 🥞"
        cheer="Super sharp taco fold! 🌮"
      />
    );
    expect(html).toContain('Flip like a pancake!');
    expect(html).toContain('Origami Coach');
    expect(html).toContain('Aoi');
  });

  it('renders procedural folding hands when coachType is hands', () => {
    const html = renderToString(
      <OrigamiCoach
        coachType="hands"
        action="crease"
        metaphor="Press the crease firmly!"
        cheer="Looking sharp!"
      />
    );
    expect(html).toContain('Press the crease firmly!');
    expect(html).toContain('Folding Hands');
  });

  it('renders Kenji avatar when coachType is kenji', () => {
    const html = renderToString(
      <OrigamiCoach
        coachType="kenji"
        action="rotate"
        metaphor="Turn like a steering wheel! 🚗"
      />
    );
    expect(html).toContain('Kenji');
    expect(html).toContain('Turn like a steering wheel!');
  });
});
