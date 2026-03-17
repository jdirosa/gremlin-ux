import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { Text } from "../layout/text";
import { Stack } from "../layout/stack";
import { quoteMarkStyles, quoteAttributionStyles } from "./quote.recipe";

export interface QuoteProps extends Omit<ComponentPropsWithoutRef<"blockquote">, "cite"> {
  children: ReactNode;
  author: string;
  source?: string;
  avatar?: ReactNode;
}

export const Quote = forwardRef<HTMLQuoteElement, QuoteProps>(
  function Quote({ children, author, source, avatar, className, ...rest }, ref) {
    return (
      <blockquote ref={ref} className={className} {...rest}>
        <Stack gap="xl" justify="between">
          <div>
            <div className={quoteMarkStyles()}>&ldquo;</div>
            <Text size="lg" color="default" lineHeight="relaxed" italic>
              {children}
            </Text>
          </div>
          <div className={quoteAttributionStyles()}>
            {avatar != null && avatar}
            <div>
              <Text as="span" size="sm" color="default" weight="semibold">
                {author}
              </Text>
              {source != null && (
                <Text as="span" size="xs" color="subtle">
                  {source}
                </Text>
              )}
            </div>
          </div>
        </Stack>
      </blockquote>
    );
  },
);
