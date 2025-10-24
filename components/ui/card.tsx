"use client"

import * as React from "react"

import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col border shadow-lg",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}


// Custom components

function GameCard({ name, img, url }: { name: string; img: string; url: string }) {
  const titleRef = React.useRef<HTMLHeadingElement>(null)
  const [fontSize, setFontSize] = React.useState<number>(24) // base size in px

  React.useEffect(() => {
    const el = titleRef.current
    if (!el) return

    const parent = el.parentElement as HTMLElement | null
    if (!parent) return

    // Fit text to one line by decreasing font size down to a minimum
    const fit = () => {
      let size = 24 // start size (px)
      const min = 12 // minimum readable size
      // Reset to start size on each measurement
      el.style.fontSize = `${size}px`
      el.style.whiteSpace = 'nowrap'
      el.style.overflow = 'hidden'

      while (el.scrollWidth > parent.clientWidth && size > min) {
        size -= 1
        el.style.fontSize = `${size}px`
      }
      setFontSize(size)
    }

    // Initial fit
    fit()

    // Observe size changes of the parent for responsive fit
    const ro = new ResizeObserver(() => fit())
    ro.observe(parent)

    // Also refit on window font changes/zoom/orientation
    window.addEventListener('resize', fit)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [name])

  return (
    <Card className="w-fit group">
      <Link href={url}>
        <CardHeader className="group-hover:bg-secondary transition-colors duration-150 bg-primary">
          <CardTitle className="text-center p-2">
            <h4 ref={titleRef} style={{ fontSize: fontSize, lineHeight: 1, whiteSpace: 'nowrap' }}>{name}</h4>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Image src={img || "/placeholder.svg"} alt={name} width={200} height={200} />
        </CardContent>
      </Link>
    </Card>
  )
}


export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,

  // Custom componentes
  GameCard
}
