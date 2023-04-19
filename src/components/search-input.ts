import Component from '../core/component';

type Props = {
  onInputValue: (arg0: string) => void;
  onInputClear: () => void;
};

/**
 * SearchInput component
 */
export default class SearchInput extends Component {
  private input!: HTMLInputElement;
  private handleInput!: EventListener;

  protected init() {
    this.handleInput = this.onInputChange.bind(this);
  }

  protected didMount() {
    this.input = this.element.querySelector('input')!;
    this.input.addEventListener('input', this.handleInput);
  }

  private onInputChange() {
    const { value } = this.input;
    const { onInputValue, onInputClear } = this.props as Props;

    if (value) {
      onInputValue?.(value);
    } else {
      onInputClear?.();
    }
  }

  setValue(value: string) {
    this.input.value = value;
    this.onInputChange();
  }

  reset() {
    this.setValue('');
    this.input?.focus();
  }

  template(): string {
    const labelId = 'searchLabel';
    const inputId = 'searchInput';
    return `
      <label id="${labelId}" for="${inputId}" class="visuallyhidden">Search for universities</label>
      <input type="search" id="${inputId}" placeholder="Search..." aria-labelledby="${labelId}">
    `;
  }

  destroy(): void {
    this.input?.removeEventListener('input', this.handleInput);
    this.input = null!;
    super.destroy();
  }
}
