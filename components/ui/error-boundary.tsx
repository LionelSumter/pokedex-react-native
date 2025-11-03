// components/ui/error-boundary.tsx
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type FallbackProps = {
  error: unknown;
  onReset: () => void;
};

class ErrorBoundaryCore extends React.Component<
  React.PropsWithChildren<{ onReset?: () => void; FallbackComponent: React.ComponentType<FallbackProps> }>,
  { error: unknown | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: unknown) {
    return { error };
  }
  reset = () => {
    this.setState({ error: null });
    this.props.onReset?.();
  };
  render() {
    const { error } = this.state;
    const { children, FallbackComponent } = this.props;
    if (error) return <FallbackComponent error={error} onReset={this.reset} />;
    return children as React.ReactNode;
  }
}

function DefaultFallback({ error, onReset }: FallbackProps) {
  const message = error instanceof Error ? error.message : 'Something went wrong';
  return (
    <View style={styles.box}>
      <Text style={styles.title}>Oops, er ging iets mis</Text>
      <Text style={styles.msg}>{message}</Text>
      <Pressable onPress={onReset} style={styles.btn}>
        <Text style={styles.btnText}>Opnieuw proberen</Text>
      </Pressable>
    </View>
  );
}

export function QueryAwareErrorBoundary({
  children,
  FallbackComponent = DefaultFallback,
}: React.PropsWithChildren<{ FallbackComponent?: React.ComponentType<FallbackProps> }>) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundaryCore onReset={reset} FallbackComponent={FallbackComponent}>
          {children}
        </ErrorBoundaryCore>
      )}
    </QueryErrorResetBoundary>
  );
}

const styles = StyleSheet.create({
  box: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  title: { fontWeight: '800', fontSize: 16, color: '#991B1B' },
  msg: { color: '#7F1D1D' },
  btn: {
    marginTop: 8,
    backgroundColor: '#111827',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700' },
});
