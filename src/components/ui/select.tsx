import { Select, Popover, Typography, Space } from 'antd';

const { Paragraph, Link } = Typography;

interface SelectBAProps<T> {
  options: T[];
  placeholder?: string;
  value?: string | null;
  onChange?: (value: string | null) => void;
  getValue: (option: T) => string;
  getLabel: (option: T) => string;
  getDescription?: (option: T) => string | undefined;
  getDocumentationUrl?: (option: T) => string | undefined;
  showPopover?: boolean;
  disabled?: boolean;
}

const SelectBA = <T,>({
  options,
  placeholder,
  value,
  onChange,
  getValue,
  getLabel,
  getDescription,
  getDocumentationUrl,
  showPopover = false,
  disabled = false,
}: SelectBAProps<T>) => {
  const renderPopoverContent = (opt: T) => {
    const description = getDescription?.(opt);
    const documentationUrl = getDocumentationUrl?.(opt);

    return (
      <Space style={{ maxWidth: 260 }} orientation='vertical' size='small'>
        {description && <Paragraph>{description}</Paragraph>}

        {documentationUrl && (
          <Link href={documentationUrl} target='_blank'>
            See more details →
          </Link>
        )}
      </Space>
    );
  };

  const mappedOptions = options.map((opt) => ({
    value: getValue(opt),
    label: showPopover ? (
      <Popover
        content={renderPopoverContent(opt)}
        trigger='hover'
        placement='rightTop'
        zIndex={1060}
      >
        <span>{getLabel(opt)}</span>
      </Popover>
    ) : (
      getLabel(opt)
    ),
  }));

  return (
    <Select
      placeholder={placeholder}
      value={value}
      onChange={(val) => onChange?.(val ?? null)}
      options={mappedOptions}
      disabled={disabled}
      allowClear
    />
  );
};

export default SelectBA;
