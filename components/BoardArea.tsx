interface BoardAreaStyles {
  readonly innerBorder: string;
  readonly outerBorder: string;
}

type ParamsT = {
  children: JSX.Element[]|JSX.Element;
  className: string;
  styles: BoardAreaStyles;
}

export default function BoardArea({
  children,
  className,
  styles
}: ParamsT) {
  return (
    <div className={className}>
      <div className={styles.outerBorder}>
        <div className={styles.innerBorder}>
          {children}
        </div>
      </div>
    </div>
  )
}
