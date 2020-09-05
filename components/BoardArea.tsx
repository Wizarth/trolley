type ParamsT = {
  children: JSX.Element[]|JSX.Element;
  className: string;
  styles: {[x: string]: string};
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
