import { test, expect } from '@playwright/test';
import {
  modalVariants,
  backdropVariants,
  fadeInVariants,
  fadeInDownVariants,
  staggerContainerVariants,
  sectionHeaderVariants,
} from '../../src/utils/animations';

test.describe('animations - Modal Variants', () => {
  // ============================================================================
  // Test: Modal Hidden State
  // ============================================================================
  test('modalVariants should have correct hidden state', () => {
    expect(modalVariants.hidden).toEqual({
      y: 50,
      opacity: 0,
      scale: 0.95,
    });
  });

  // ============================================================================
  // Test: Modal Visible State
  // ============================================================================
  test('modalVariants should have correct visible state with transition', () => {
    expect(modalVariants.visible).toEqual({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    });
  });

  // ============================================================================
  // Test: Modal Exit State
  // ============================================================================
  test('modalVariants should have correct exit state with transition', () => {
    expect(modalVariants.exit).toEqual({
      y: 50,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    });
  });
});

test.describe('animations - Backdrop Variants', () => {
  // ============================================================================
  // Test: Backdrop Hidden State
  // ============================================================================
  test('backdropVariants should have correct hidden state', () => {
    expect(backdropVariants.hidden).toEqual({
      opacity: 0,
    });
  });

  // ============================================================================
  // Test: Backdrop Visible State
  // ============================================================================
  test('backdropVariants should have correct visible state with transition', () => {
    expect(backdropVariants.visible).toEqual({
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    });
  });

  // ============================================================================
  // Test: Backdrop Exit State
  // ============================================================================
  test('backdropVariants should have correct exit state with transition', () => {
    expect(backdropVariants.exit).toEqual({
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    });
  });
});

test.describe('animations - Fade In Variants', () => {
  // ============================================================================
  // Test: Simple Fade Hidden State
  // ============================================================================
  test('fadeInVariants should have correct hidden state', () => {
    expect(fadeInVariants.hidden).toEqual({
      opacity: 0,
    });
  });

  // ============================================================================
  // Test: Simple Fade Visible State
  // ============================================================================
  test('fadeInVariants should have correct visible state with transition', () => {
    expect(fadeInVariants.visible).toEqual({
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    });
  });
});

test.describe('animations - Fade In Down Variants', () => {
  // ============================================================================
  // Test: Fade Down Hidden State
  // ============================================================================
  test('fadeInDownVariants should have correct hidden state with y offset', () => {
    expect(fadeInDownVariants.hidden).toEqual({
      opacity: 0,
      y: -20,
    });
  });

  // ============================================================================
  // Test: Fade Down Visible State
  // ============================================================================
  test('fadeInDownVariants should have correct visible state with transition', () => {
    expect(fadeInDownVariants.visible).toEqual({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    });
  });
});

test.describe('animations - Stagger Container Variants', () => {
  // ============================================================================
  // Test: Container Hidden State
  // ============================================================================
  test('staggerContainerVariants should have correct hidden state', () => {
    expect(staggerContainerVariants.hidden).toEqual({
      opacity: 0,
    });
  });

  // ============================================================================
  // Test: Container Visible State with Stagger
  // ============================================================================
  test('staggerContainerVariants should have staggerChildren transition', () => {
    expect(staggerContainerVariants.visible).toEqual({
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    });
  });
});

test.describe('animations - Section Header Variants', () => {
  // ============================================================================
  // Test: Header Hidden State
  // ============================================================================
  test('sectionHeaderVariants should have correct hidden state with x offset', () => {
    expect(sectionHeaderVariants.hidden).toEqual({
      opacity: 0,
      x: -20,
    });
  });

  // ============================================================================
  // Test: Header Visible State
  // ============================================================================
  test('sectionHeaderVariants should have correct visible state with transition', () => {
    expect(sectionHeaderVariants.visible).toEqual({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    });
  });
});

test.describe('animations - Variant Structure Validation', () => {
  // ============================================================================
  // Test: All Variants Have Required States
  // ============================================================================
  test('all main animation variants should have hidden and visible states', () => {
    const allVariants = [
      modalVariants,
      backdropVariants,
      fadeInVariants,
      fadeInDownVariants,
      staggerContainerVariants,
      sectionHeaderVariants,
    ];

    allVariants.forEach((variant) => {
      expect(variant).toHaveProperty('hidden');
      expect(variant).toHaveProperty('visible');
    });
  });

  // ============================================================================
  // Test: Modal and Backdrop Have Exit States
  // ============================================================================
  test('modal and backdrop variants should have exit states', () => {
    expect(modalVariants).toHaveProperty('exit');
    expect(backdropVariants).toHaveProperty('exit');
  });

  // ============================================================================
  // Test: All Transitions Use Consistent Easing
  // ============================================================================
  test('all visible transitions should use easeOut or have no ease', () => {
    const checkEasing = (variant: any) => {
      if (variant.visible?.transition?.ease) {
        expect(variant.visible.transition.ease).toBe('easeOut');
      }
    };

    checkEasing(modalVariants);
    checkEasing(fadeInVariants);
    checkEasing(fadeInDownVariants);
    checkEasing(sectionHeaderVariants);
  });
});
