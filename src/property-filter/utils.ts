// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  ComparisonOperator,
  InternalFilteringOption,
  InternalFilteringProperty,
  InternalToken,
  Token,
} from './interfaces';

// Finds the longest property the filtering text starts from.
export function matchFilteringProperty(
  filteringProperties: readonly InternalFilteringProperty[],
  filteringText: string
): null | InternalFilteringProperty {
  let maxLength = 0;
  let matchedProperty: null | InternalFilteringProperty = null;

  for (const property of filteringProperties) {
    if (
      (property.propertyLabel.length >= maxLength && startsWith(filteringText, property.propertyLabel)) ||
      (property.propertyLabel.length > maxLength &&
        startsWith(filteringText.toLowerCase(), property.propertyLabel.toLowerCase()))
    ) {
      maxLength = property.propertyLabel.length;
      matchedProperty = property;
    }
  }

  return matchedProperty;
}

// Finds the longest operator the filtering text starts from.
export function matchOperator(
  allowedOperators: readonly ComparisonOperator[],
  filteringText: string
): null | ComparisonOperator {
  filteringText = filteringText.toLowerCase();

  let maxLength = 0;
  let matchedOperator: null | ComparisonOperator = null;

  for (const operator of allowedOperators) {
    if (operator.length > maxLength && startsWith(filteringText, operator.toLowerCase())) {
      maxLength = operator.length;
      matchedOperator = operator;
    }
  }

  return matchedOperator;
}

// Finds if the filtering text matches any operator prefix.
export function matchOperatorPrefix(
  allowedOperators: readonly ComparisonOperator[],
  filteringText: string
): null | string {
  if (filteringText.trim().length === 0) {
    return '';
  }
  for (const operator of allowedOperators) {
    if (startsWith(operator.toLowerCase(), filteringText.toLowerCase())) {
      return filteringText;
    }
  }
  return null;
}

export function matchTokenValue(
  { property, operator, value }: InternalToken,
  filteringOptions: readonly InternalFilteringOption[]
): Token {
  const tokenType = property?.getTokenType(operator);
  const propertyOptions = filteringOptions.filter(option => option.property === property);
  const castValue = (value: unknown) => {
    if (value === null) {
      return tokenType === 'enum' ? [] : null;
    }
    return tokenType === 'enum' && !Array.isArray(value) ? [value] : value;
  };
  const bestMatch: Token = { propertyKey: property?.propertyKey, operator, value: castValue(value) };

  for (const option of propertyOptions) {
    if ((option.label && option.label === value) || (!option.label && option.value === value)) {
      // exact match found: return it
      return { propertyKey: property?.propertyKey, operator, value: castValue(option.value) };
    }

    // By default, the token value is a string, but when a custom property is used,
    // the token value can be any, therefore we need to check for its type before calling toLowerCase()
    if (typeof value === 'string' && value.toLowerCase() === (option.label ?? option.value ?? '').toLowerCase()) {
      // non-exact match: save and keep running in case exact match found later
      bestMatch.value = castValue(option.value);
    }
  }

  return bestMatch;
}

export function trimStart(source: string): string {
  let spacesLength = 0;
  for (let i = 0; i < source.length; i++) {
    if (source[i] === ' ') {
      spacesLength++;
    } else {
      break;
    }
  }
  return source.slice(spacesLength);
}

function trimFirstSpace(source: string): string {
  return source[0] === ' ' ? source.slice(1) : source;
}

export function removeOperator(source: string, operator: string) {
  const operatorLastIndex = source.indexOf(operator) + operator.length;
  const textWithoutOperator = source.slice(operatorLastIndex);
  // We need to remove the first leading space in case the user presses space
  // after the operator, for example: Owner: admin, will result in value of ` admin`
  // and we need to remove the first space, if the user added any more spaces only the
  // first one will be removed.
  return trimFirstSpace(textWithoutOperator);
}

function startsWith(source: string, target: string): boolean {
  return source.indexOf(target) === 0;
}

interface AbstractToken {
  operator: any;
}

interface AbstractTokenGroup<T extends AbstractToken> {
  operation: any;
  tokens: readonly (T | AbstractTokenGroup<T>)[];
}

/**
 * Transforms query token groups to tokens (only taking 1 level of nesting).
 */
export function tokenGroupToTokens<T extends AbstractToken>(tokenGroups: readonly (T | AbstractTokenGroup<T>)[]): T[] {
  const tokens: T[] = [];
  for (const tokenOrGroup of tokenGroups) {
    if ('operator' in tokenOrGroup) {
      tokens.push(tokenOrGroup);
    } else {
      for (const nestedTokenOrGroup of tokenOrGroup.tokens) {
        if ('operator' in nestedTokenOrGroup) {
          tokens.push(nestedTokenOrGroup);
        } else {
          // Ignore deeply nested tokens
        }
      }
    }
  }
  return tokens;
}
