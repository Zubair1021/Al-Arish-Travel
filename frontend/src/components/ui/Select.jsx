import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import './select.css'

const MAX_DROPDOWN_HEIGHT = 280

export default function Select({
  value,
  onChange,
  options = [],
  placeholder = 'Select…',
  theme = 'public',
  size = 'md',
  disabled = false,
  id,
  name,
  ariaLabel,
  className = '',
  dropdownClassName = '',
  dropdownMinWidth = 0,
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [pos, setPos] = useState({
    top: 0,
    left: 0,
    width: 0,
    openUp: false,
    maxHeight: MAX_DROPDOWN_HEIGHT,
  })
  const buttonRef = useRef(null)
  const dropdownRef = useRef(null)
  const typeBufferRef = useRef({ str: '', timer: null })

  const selected = options.find((o) => o.value === value)
  const themeClass = theme === 'admin' ? 'ui-select-admin' : 'ui-select-public'

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom - 12
    const spaceAbove = rect.top - 12
    const wantsHeight = Math.min(MAX_DROPDOWN_HEIGHT, options.length * 40 + 16)
    const openUp = spaceBelow < wantsHeight && spaceAbove > spaceBelow
    const maxHeight = Math.max(120, openUp ? spaceAbove : spaceBelow)
    setPos({
      top: openUp ? rect.top - 6 : rect.bottom + 6,
      left: rect.left,
      width: rect.width,
      openUp,
      maxHeight: Math.min(maxHeight, MAX_DROPDOWN_HEIGHT),
    })
  }, [options.length])

  useLayoutEffect(() => {
    if (!open) return undefined
    updatePosition()
    const onScroll = () => updatePosition()
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [open, updatePosition])

  useEffect(() => {
    if (!open) return undefined
    const handleClickOutside = (event) => {
      if (
        buttonRef.current?.contains(event.target) ||
        dropdownRef.current?.contains(event.target)
      ) {
        return
      }
      setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  useEffect(() => {
    if (open) {
      const idx = options.findIndex((o) => o.value === value)
      setActive(idx >= 0 ? idx : 0)
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open || active < 0 || !dropdownRef.current) return
    const item = dropdownRef.current.querySelector(`[data-index="${active}"]`)
    item?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const select = (optionValue) => {
    onChange?.(optionValue)
    setOpen(false)
    setTimeout(() => buttonRef.current?.focus(), 0)
  }

  const handleTypeahead = (char) => {
    if (typeBufferRef.current.timer) clearTimeout(typeBufferRef.current.timer)
    typeBufferRef.current.str = (typeBufferRef.current.str + char).toLowerCase()
    const idx = options.findIndex((o) =>
      String(o.label).toLowerCase().startsWith(typeBufferRef.current.str),
    )
    if (idx >= 0) setActive(idx)
    typeBufferRef.current.timer = setTimeout(() => {
      typeBufferRef.current.str = ''
    }, 600)
  }

  const handleKeyDown = (event) => {
    if (disabled) return
    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
        event.preventDefault()
        setOpen(true)
      }
      return
    }
    switch (event.key) {
      case 'Escape':
        event.preventDefault()
        setOpen(false)
        setTimeout(() => buttonRef.current?.focus(), 0)
        break
      case 'Tab':
        setOpen(false)
        break
      case 'ArrowDown':
        event.preventDefault()
        setActive((a) => Math.min(options.length - 1, a + 1))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActive((a) => Math.max(0, a - 1))
        break
      case 'Home':
        event.preventDefault()
        setActive(0)
        break
      case 'End':
        event.preventDefault()
        setActive(options.length - 1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (active >= 0 && options[active]) select(options[active].value)
        break
      default:
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
          handleTypeahead(event.key)
        }
    }
  }

  return (
    <div
      className={`ui-select ${themeClass} ui-select-size-${size}${open ? ' is-open' : ''}${disabled ? ' is-disabled' : ''} ${className}`.trim()}
    >
      <button
        ref={buttonRef}
        type="button"
        className="ui-select-trigger"
        id={id}
        name={name}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
      >
        <span className={`ui-select-value${selected ? '' : ' is-placeholder'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="ui-select-caret" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className={`ui-select-pop ${themeClass}${pos.openUp ? ' is-up' : ''} ${dropdownClassName}`.trim()}
            style={{
              position: 'fixed',
              top: pos.openUp ? undefined : pos.top,
              bottom: pos.openUp ? window.innerHeight - pos.top : undefined,
              left: pos.left,
              width: Math.max(pos.width, dropdownMinWidth),
              maxHeight: pos.maxHeight,
            }}
            role="listbox"
            tabIndex={-1}
            onKeyDown={handleKeyDown}
          >
            <ul className="ui-select-list">
              {options.length === 0 ? (
                <li className="ui-select-empty">No options</li>
              ) : (
                options.map((opt, i) => (
                  <li
                    key={`${opt.value}-${i}`}
                    data-index={i}
                    role="option"
                    aria-selected={opt.value === value}
                    className={`ui-select-option${i === active ? ' is-active' : ''}${opt.value === value ? ' is-selected' : ''}`}
                    onMouseEnter={() => setActive(i)}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      select(opt.value)
                    }}
                  >
                    <span className="ui-select-option-label">{opt.label}</span>
                    {opt.value === value && (
                      <svg
                        className="ui-select-check"
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="5 12 10 17 19 7" />
                      </svg>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>,
          document.body,
        )}
    </div>
  )
}
