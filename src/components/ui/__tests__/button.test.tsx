import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';

describe('Button component', () => {
    it('renders with default props', () => {
        render(<Button>Click me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
    });

    it('renders with custom className', () => {
        render(<Button className="custom-class">Button</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
    });

    it('applies variant styles correctly', () => {
        const { rerender } = render(<Button variant="default">Default</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'default');

        rerender(<Button variant="destructive">Destructive</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'destructive');

        rerender(<Button variant="outline">Outline</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'outline');

        rerender(<Button variant="secondary">Secondary</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'secondary');

        rerender(<Button variant="ghost">Ghost</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'ghost');

        rerender(<Button variant="link">Link</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'link');
    });

    it('applies size styles correctly', () => {
        const { rerender } = render(<Button size="default">Default</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('data-size', 'default');

        rerender(<Button size="sm">Small</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('data-size', 'sm');

        rerender(<Button size="lg">Large</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('data-size', 'lg');

        rerender(<Button size="icon">Icon</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('data-size', 'icon');
    });

    it('handles click events', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();
        
        render(<Button onClick={handleClick}>Click</Button>);
        await user.click(screen.getByRole('button'));
        
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('can be disabled', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('renders as child when asChild is true', () => {
        render(
            <Button asChild>
                <span data-href="/test">Link Button</span>
            </Button>
        );
        const element = screen.getByText(/link button/i);
        expect(element).toBeInTheDocument();
        expect(element).toHaveAttribute('data-href', '/test');
    });

    it('forwards additional props', () => {
        render(<Button data-testid="custom-button" type="submit">Submit</Button>);
        const button = screen.getByTestId('custom-button');
        expect(button).toHaveAttribute('type', 'submit');
    });

    it('has correct data-slot attribute', () => {
        render(<Button>Button</Button>);
        expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'button');
    });
});
